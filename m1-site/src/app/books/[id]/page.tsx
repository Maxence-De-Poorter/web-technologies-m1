"use client";

import { useEffect, useState } from 'react';
import Breadcrumb from "../../../components/Breadcrumb";
import PageTitle from "../../../components/PageTitle";

type Author = {
    id: number;
    first_name: string;
    last_name: string;
};

type Book = {
    id: number;
    title: string;
    year_published: number;
    price: number;
    author?: Author;
};

interface BookDetailsPageProps {
    params: { id: string };
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchBookDetails(params.id);
        }
    }, [params.id]);

    const fetchBookDetails = async (bookId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/books/${bookId}`);
            if (!response.ok) {
                console.error("Erreur lors de la récupération du livre");
                return;
            }
            const data = await response.json();
            setBook(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    if (!book) return <p>Chargement...</p>;

    return (
        <div>
            <PageTitle>Détails du livre</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Accueil" },
                { href: "/books", label: "Liste des livres" },
                { href: `/books/${book.id}`, label: book.title }
            ]} />

            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold">{book.title}</h2>
                <p>Auteur : {book.author ? `${book.author.first_name} ${book.author.last_name}` : "Auteur inconnu"}</p>
                <p>Date de publication : {book.year_published}</p>
                <p>Prix : {book.price}$</p>
            </div>
        </div>
    );
}