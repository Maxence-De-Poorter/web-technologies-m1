import Link from "next/link";

// Navbar component displaying a navigation bar with links to Home, Books, and Authors pages
const Navbar = () => (
    <nav className="bg-gray-800 p-4">
        <ul className="flex justify-center space-x-8">
            {/* Link to the Home page */}
            <li><Link href={"/"} className="text-white hover:text-gray-300">Home</Link></li>
            {/* Link to the Books page */}
            <li><Link href={"/books"} className="text-white hover:text-gray-300">Books</Link></li>
            {/* Link to the Authors page */}
            <li><Link href={"/authors"} className="text-white hover:text-gray-300">Authors</Link></li>
        </ul>
    </nav>
);

export default Navbar;