import Link from "next/link";

const Navbar=()=>(
    <nav className="bg-gray-800 p-4">
        <ul className="flex justify-center space-x-8">
            <li><Link href={"/"} className="text-white hover:text-gray-300">Accueil</Link></li>
            <li><Link href={"/books"} className="text-white hover:text-gray-300">Livres</Link></li>
            <li><Link href={"/authors"} className="text-white hover:text-gray-300">Auteurs</Link></li>
        </ul>
    </nav>
);

export default Navbar;