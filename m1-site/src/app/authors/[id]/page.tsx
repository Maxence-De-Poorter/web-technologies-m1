
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from "../../../components/Breadcrumb";
import PageTitle from "../../../components/PageTitle";

type Author = {
    id: string;
    first_name: string;
    last_name: string;
    photo: string;
    biography: string;
};

type Book = {
    id: string;
    title: string;
    year_published: number;
    price: number;
    authorId: string;
};

interface AuthorDetailsPageProps {
    params: { id: string };
}

export default function AuthorDetailsPage({ params }: AuthorDetailsPageProps) {
    const [author, setAuthor] = useState<Author | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [isDeleteModalBookOpen, setIsDeleteModalBookOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // État pour le modal de modification
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [editFormData, setEditFormData] = useState({ first_name: '', last_name: '', photo: '', biography: '' }); // État pour les données du formulaire de modification
    const router = useRouter();

    useEffect(() => {
        if (params.id) {
            fetchAuthorDetails(params.id);
            fetchBooksByAuthor(params.id);
        }
    }, [params.id]);

    const fetchAuthorDetails = async (authorId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/authors/${authorId}`);
            if (!response.ok) {
                console.error("Erreur lors de la récupération de l'auteur");
                return;
            }
            const data = await response.json();
            setAuthor(data);
            setEditFormData({ first_name: data.first_name, last_name: data.last_name, photo: data.photo, biography: data.biography }); // Initialiser les données du formulaire de modification
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const fetchBooksByAuthor = async (authorId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/books`);
            if (!response.ok) {
                console.error("Erreur lors de la récupération des livres");
                return;
            }
            const data: Book[] = await response.json();
            const filteredBooks = data.filter((book) => book.author.id === authorId);
            setBooks(filteredBooks);
            console.log(filteredBooks);

            if (filteredBooks.length === 0) {
                console.log("Aucun livre trouvé pour cet auteur.");
            }
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const openDeleteModal = (book: Book) => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteAuthor = async () => {
        if (author) {
            try {
                const response = await fetch(`http://localhost:3001/authors/${author.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    console.error("Erreur lors de la suppression de cet auteur");
                    return;
                }
                router.push("/authors");
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    const openDeleteBookModal = (book: Book) => {
        setSelectedBook(book);
        setIsDeleteModalBookOpen(true);
    };

    const closeDeleteBookModal = () => {
        setIsDeleteModalBookOpen(false);
        setSelectedBook(null);
    };

    const handleDeleteBook = async () => {
        if (selectedBook) {
            try {
                const response = await fetch(`http://localhost:3001/books/${selectedBook.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    console.error("Erreur lors de la suppression du livre");
                    return;
                }
                setBooks(books.filter(book => book.id !== selectedBook.id));
                closeDeleteModal();
                router.push("/authors");
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (author) {
            try {
                const response = await fetch(`http://localhost:3001/authors/${author.id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editFormData),
                });
                if (!response.ok) {
                    console.error("Erreur lors de la modification de l'auteur");
                    return;
                }
                const updatedAuthor = await response.json();
                setAuthor(updatedAuthor);
                closeEditModal();
            } catch (error) {
                console.error("Erreur:", error);
            }
        }
    };

    if (!author) return <p>Chargement...</p>;

    return (
        <div>
            <PageTitle>Détails de l'auteur</PageTitle>
            <Breadcrumb links={[{ href: "/", label: "Accueil" }, { href: "/authors", label: "Liste des Auteurs" }, { href: `/authors/${author.id}`, label: `${author.first_name} ${author.last_name}` }]} />

            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[500px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Options</h1>
                    <button onClick={openEditModal} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4">Modifier cet auteur</button>
                    <button onClick={openDeleteModal} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4">Supprimer cet auteur</button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="border p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">{author.first_name} {author.last_name}</h2>
                        <img src={author.photo} alt={`${author.first_name} ${author.last_name}`} className="w-32 h-32 mb-4" />
                        <p className="mb-4"><strong>Biographie :</strong> {author.biography}</p>

                        <h3 className="text-xl font-semibold mt-6">Livres</h3>
                        {books.length > 0 ? (
                            <ul className="list-disc pl-5 mt-2">
                                {books.map(book => (
                                    <li key={book.id} className="mb-2">
                                        <span className="font-medium">{book.title}</span> - {book.year_published} - {book.price}$
                                        <button onClick={() => openDeleteBookModal(book)} className="ml-4 text-red-500 hover:underline">Supprimer</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2">Cet auteur n'a pas encore de livres.</p>
                        )}
                    </div>
                </main>
            </div>

            {isDeleteModalBookOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer ce livre ?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeDeleteBookModal} className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                            <button onClick={handleDeleteBook} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
                {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer l'auteur {author.first_name + " " + author.last_name} ?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeDeleteModal} className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                            <button onClick={handleDeleteAuthor} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Modifier l'auteur</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={editFormData.first_name}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={editFormData.last_name}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">URL de la photo</label>
                                <input
                                    type="text"
                                    id="photo"
                                    name="photo"
                                    value={editFormData.photo}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="biography" className="block text-sm font-medium text-gray-700">Biographie</label>
                                <textarea
                                    id="biography"
                                    name="biography"
                                    value={editFormData.biography}
                                    onChange={handleEditChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end mt-4">
                                <button onClick={closeEditModal} className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Annuler</button>
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
