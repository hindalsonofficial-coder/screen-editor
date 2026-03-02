export const POPULAR_GOOGLE_FONTS = [
    "Roboto", "Open Sans", "Montserrat", "Lato", "Poppins", "Inter", "Numans",
    "Merriweather", "Playfair Display", "Nunito", "Rubik", "Mukta", "Quicksand",
    "Work Sans", "Raleway", "PT Sans", "Oswald", "Inconsolata", "Kanit",
    "Barlow", "Titillium Web", "DM Sans", "Heebo", "Libre Franklin", "Karla",
    "Josefin Sans", "Libre Baskerville", "Anton", "Cabin", "Arvo", "Dancing Script",
    "Pacifico", "Lobster", "Comfortaa", "Exo 2", "Fira Sans", "Crimson Text",
    "Bitter", "Oxygen", "Abel", "Hind", "Manrope", "Nanum Gothic", "Dosis",
    "Cairo", "Arimo", "EB Garamond", "Domine", "Bebas Neue", "Signika"
].sort();

export const loadGoogleFont = (fontFamily: string) => {
    if (!fontFamily) return;

    // Check if style already exists
    const id = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
    document.head.appendChild(link);
};
