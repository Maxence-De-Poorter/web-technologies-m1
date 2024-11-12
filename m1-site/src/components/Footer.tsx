import Link from "next/link";

const Footer = () => (
    <footer className="bg-gray-800 p-4 mt-8">
        <ul className="flex justify-center space-x-8">
            <li><Link href={"/"} className="text-white hover:text-gray-300">Accueil</Link></li>
            <li><Link href={"/books"} className="text-white hover:text-gray-300">Livres</Link></li>
            <li><Link href={"/authors"} className="text-white hover:text-gray-300">Auteurs</Link></li>
        </ul>
        <p className="text-center text-white mt-4">&copy; 2024 M1 - Technologies Web. Tous droits réservés.</p>
    </footer>
);

export default Footer;