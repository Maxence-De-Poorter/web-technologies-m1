"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");

    const fetchBooks = async (title = "", authorId = "", order = "DESC") => {
        try {
            const query = new URLSearchParams();
            if (title) query.append("title", title);
            if (authorId) query.append("author_id", authorId);
            query.append("order", order);

            const response = await fetch(`http://localhost:3001/books?${query.toString()}`);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des livres");
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const fetchAuthors = async () => {
        try {
            const response = await fetch("http://localhost:3001/authors");
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des auteurs");
            }
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchAuthors();
    }, []);

    const handleApplyFilters = () => {
        fetchBooks(searchTitle, selectedAuthor, sortOrder);
    };

    return (
        <div>
            <PageTitle>Liste des livres</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Accueil" },
                { href: "/books", label: "Liste des livres" },
            ]} />
            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[500px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Filtres</h1>

                    <input
                        type="text"
                        placeholder="Rechercher par titre"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded"
                    />

                    <select
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded bg-white text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tous les auteurs</option>
                        {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.first_name} {author.last_name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded bg-white text-gray-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="DESC">Du plus récent au plus ancien</option>
                        <option value="ASC">Du plus ancien au plus récent</option>
                    </select>

                    <button
                        onClick={handleApplyFilters}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Appliquer les filtres
                    </button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {books.map((book) => (
                            <div key={book.id} className="border p-4 rounded-lg shadow-md">
                                <h2 className="text-lg font-semibold">{book.title}</h2>
                                <p>Auteur : {book.author ? `${book.author.first_name} ${book.author.last_name}` : "Auteur inconnu"}</p>
                                <p>Date de publication : {book.year_published}</p>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}