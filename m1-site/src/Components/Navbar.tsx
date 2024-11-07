import Link from "next/link";

const Navbar=()=>(
    <nav>
        <ul>
            <li><Link href={"/"}>Accueil</Link></li>
            <li><Link href={"/books"}>Livres</Link></li>
            <li><Link href={"/authors"}>Auteurs</Link></li>
        </ul>
    </nav>
);

export default Navbar;