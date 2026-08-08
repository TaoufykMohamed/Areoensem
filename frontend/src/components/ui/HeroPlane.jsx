/**
 * Avion décoratif qui traverse le hero en diagonale, en boucle infinie.
 * Purement décoratif : aria-hidden, aucune interaction, désactivé si
 * l'utilisateur préfère un mouvement réduit (voir index.css).
 */
export default function HeroPlane() {
  return (
    <div className="hero-plane" aria-hidden="true">
      <svg className="hero-plane__icon" viewBox="0 0 100 100" fill="currentColor">
        <path d="M95 50 L58 41 L14 44 L7 50 L14 56 L58 59 Z M60 43 L24 12 L44 47 Z M60 57 L24 88 L44 53 Z M20 46 L3 32 L17 49 Z M20 54 L3 68 L17 51 Z" />
      </svg>
    </div>
  );
}
