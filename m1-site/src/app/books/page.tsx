"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

type Author = {
    id: number;
    first_name: string;
    last_name: string;
};

type Book = {
    id: number;
    title: string;
    year_published: number;
    author?: Author;
};

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [selectedAuthor, setSelectedAuthor] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBook, setNewBook] = useState({ title: "", year_published: "", author_id: "" });

    const fetchBooks = async (title = "", authorId = "", order = "DESC") => {
        try {
            const query = new URLSearchParams();
            if (title) query.append("title", title);
            if (authorId) query.append("author_id", authorId);
            query.append("order", order);

            const response = await fetch(`http://localhost:3001/books?${query.toString()}`);
            if (!response.ok) {
                console.error("Erreur lors de la récupération des livres");
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
                console.error("Erreur lors de la récupération des auteurs");
            }
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const handleCreateBook = async () => {
        try {
            const response = await fetch("http://localhost:3001/books", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBook),
            });
            if (!response.ok) {
                console.error("Erreur lors de la création du livre");
            }
            setIsModalOpen(false);
            setNewBook({ title: "", year_published: "", author_id: "" });
            await fetchBooks(); // Rafraîchit la liste des livres
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
                {href: "/", label: "Accueil"},
                {href: "/books", label: "Liste des livres"},
            ]}/>

            {/* Modale de création de livre */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Créer un nouveau livre</h2>
                        <input
                            type="text"
                            placeholder="Titre"
                            value={newBook.title}
                            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Date de publication"
                            value={newBook.year_published}
                            onChange={(e) => setNewBook({...newBook, year_published: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <select
                            value={newBook.author_id}
                            onChange={(e) => setNewBook({...newBook, author_id: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        >
                            <option value="">Sélectionner un auteur</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.first_name} {author.last_name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreateBook}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Liste des livres */}
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
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
                    >
                        Appliquer les filtres
                    </button>

                    {/* Bouton pour ajouter un nouveau livre */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Ajouter un nouveau livre
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