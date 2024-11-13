"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedYearPublished, setEditedYearPublished] = useState<number | "">("");
    const [editedPrice, setEditedPrice] = useState<number | "">("");
    const router = useRouter();

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
            setEditedTitle(data.title);
            setEditedYearPublished(data.year_published);
            setEditedPrice(data.price);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    const handleDeleteBook = async () => {
        if (book) {
            try {
                const response = await fetch(`http://localhost:3001/books/${book.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    console.error("Erreur lors de la suppression du livre");
                    return;
                }
                router.push("/books");
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    const handleEditBook = async () => {
        if (book) {
            try {
                const response = await fetch(`http://localhost:3001/books/${book.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: editedTitle,
                        year_published: editedYearPublished,
                        price: editedPrice
                    }),
                });
                if (!response.ok) {
                    console.error("Erreur lors de la modification du livre");
                    return;
                }
                closeEditModal();
                fetchBookDetails(book.id.toString());
            } catch (error) {
                console.error("Erreur:", error);
            }
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

            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[500px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Options</h1>
                    <button
                        onClick={openEditModal}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4"
                    >
                        Modifier ce livre
                    </button>
                    <button
                        onClick={openDeleteModal}
                        className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
                    >
                        Supprimer ce livre
                    </button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="border p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">{book.title}</h2>
                        <p>Auteur : {book.author ? (
                            <Link href={`/authors/${book.author.id}`} className="text-blue-500 hover:underline">
                                {book.author.first_name} {book.author.last_name}
                            </Link>
                        ) : "Auteur inconnu"}</p>
                        <p>Date de publication : {book.year_published}</p>
                        <p>Prix : {book.price}$</p>
                    </div>
                </main>
            </div>

            {/* Modal de confirmation de suppression */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer le livre "{book.title}" ?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeDeleteModal}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteBook}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de modification */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Modifier le livre</h2>
                        <input
                            type="text"
                            placeholder="Titre"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Date de publication"
                            value={editedYearPublished}
                            onChange={(e) => setEditedYearPublished(Number(e.target.value))}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Prix"
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(Number(e.target.value))}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={closeEditModal}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleEditBook}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}