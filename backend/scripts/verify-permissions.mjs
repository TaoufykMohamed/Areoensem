// Vérifie le modèle de permissions (requireRole / requireCellOwnership)
// contre de vraies données de seed. Pas un framework de test : un script
// autonome à relancer après toute modification des middlewares de rôles,
// pour ne pas découvrir une régression une fois le dashboard construit.
//
// Usage : npm run verify:permissions  (nécessite la base seedée et Mongo up)
import assert from "node:assert/strict";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { User, Cell } from "../src/models/index.js";
import { requireCellOwnership, requireRole } from "../src/middleware/roles.js";

await connectDB();

function mockRes() {
  const res = { statusCode: null, body: null };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  return res;
}

async function runMiddleware(mw, req) {
  const res = mockRes();
  let nextErr = "not-called";
  await new Promise((resolve) => {
    mw(req, res, (err) => {
      nextErr = err ?? null;
      resolve();
    });
  });
  return { res, nextErr };
}

const admin = await User.findOne({ role: "admin" });
const cellA = await Cell.findOne({ nomFr: "Conception & CAO" });
const cellB = await Cell.findOne({ nomFr: "Aérodynamique & Mécanique du vol" });
const chefA = await User.findOne({ cellule: cellA._id, role: "chef_cellule" });

assert.ok(admin && cellA && cellB && chefA, "données de seed manquantes pour le test");

const ownership = requireCellOwnership({ model: Cell, param: "id", cellField: "_id" });

// 1) admin : bypass total, même sur une cellule qui n'est pas la sienne
{
  const { nextErr } = await runMiddleware(ownership, {
    user: admin,
    params: { id: cellB._id.toString() },
  });
  assert.equal(nextErr, null, "admin devrait passer sans erreur");
  console.log("PASS  admin bypass -> next() sans erreur");
}

// 2) chef sur SA PROPRE cellule : autorisé
{
  const { nextErr } = await runMiddleware(ownership, {
    user: chefA,
    params: { id: cellA._id.toString() },
  });
  assert.equal(nextErr, null, "chef sur sa propre cellule devrait passer");
  console.log("PASS  chef sur sa cellule -> next() sans erreur");
}

// 3) chef sur une AUTRE cellule : 403, pas 404
{
  const { nextErr } = await runMiddleware(ownership, {
    user: chefA,
    params: { id: cellB._id.toString() },
  });
  assert.ok(nextErr, "un chef sur une autre cellule doit être rejeté");
  assert.equal(nextErr.statusCode, 403, `attendu 403, reçu ${nextErr.statusCode}`);
  console.log("PASS  chef sur une autre cellule -> 403:", nextErr.message);
}

// 4) ressource inexistante : 404 (distinct du 403 ci-dessus)
{
  const fakeId = "000000000000000000000000";
  const { nextErr } = await runMiddleware(ownership, {
    user: chefA,
    params: { id: fakeId },
  });
  assert.ok(nextErr, "id inexistant doit être rejeté");
  assert.equal(nextErr.statusCode, 404, `attendu 404, reçu ${nextErr.statusCode}`);
  console.log("PASS  cellule inexistante -> 404 (distinct du 403 ci-dessus)");
}

// 5) requireRole
{
  const mwAdminOnly = requireRole("admin");
  const { nextErr: e1 } = await runMiddleware(mwAdminOnly, { user: chefA });
  assert.equal(e1?.statusCode, 403, "chef_cellule ne doit pas passer requireRole('admin')");
  console.log("PASS  requireRole('admin') refuse un chef_cellule -> 403");

  const { nextErr: e2 } = await runMiddleware(mwAdminOnly, { user: admin });
  assert.equal(e2, null, "admin doit passer requireRole('admin')");
  console.log("PASS  requireRole('admin') autorise un admin");

  const { nextErr: e3 } = await runMiddleware(mwAdminOnly, { user: null });
  assert.equal(e3?.statusCode, 401, "sans utilisateur -> 401");
  console.log("PASS  requireRole sans req.user -> 401");
}

console.log("\nTous les tests de permissions sont au vert.");

await disconnectDB();
process.exit(0);
