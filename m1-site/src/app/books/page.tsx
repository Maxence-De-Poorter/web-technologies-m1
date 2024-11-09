"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

export default function BooksPage() {
    const [books, setBooks] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");

    const fetchBooks = async (title = "") => {
        try {
            const query = title ? `?title=${encodeURIComponent(title)}` : "";
            const response = await fetch(`http://localhost:3001/books${query}`);
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des livres");
            }
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleApplyFilters = () => {
        fetchBooks(searchTitle);
    };

    return (
        <div>
            <PageTitle>Liste des livres</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Accueil" },
                { href: "/books", label: "Liste des livres" },
            ]} />

            <div>
                <input
                    type="text"
                    placeholder="Rechercher par titre"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                />
                <button onClick={handleApplyFilters}>Appliquer les filtres</button>
            </div>

            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <h2>{book.title}</h2>
                        <p>Auteur : {book.author ? `${book.author.first_name} ${book.author.last_name}` : "Auteur inconnu"}</p>
                        <p>Date de publication : {book.publishedDate}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}