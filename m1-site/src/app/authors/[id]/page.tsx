"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumb from "../../../components/Breadcrumb";
import PageTitle from "../../../components/PageTitle";

// Define types for Author and Book
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
    params: { id: string }; // The author id passed as a parameter to the page
}

export default function AuthorDetailsPage({ params }: AuthorDetailsPageProps) {
    // State hooks for managing author and book data
    const [author, setAuthor] = useState<Author | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [isDeleteModalBookOpen, setIsDeleteModalBookOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For editing the author
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [editFormData, setEditFormData] = useState({ first_name: '', last_name: '', photo: '', biography: '' }); // For the edit form data
    const router = useRouter(); // Next.js router for navigation

    // Fetch author details and books on component mount (via useEffect hook)
    useEffect(() => {
        if (params.id) {
            fetchAuthorDetails(params.id)
                .then(() => fetchBooksByAuthor(params.id)  // Fetch books after author details are fetched
                    .catch(error => {
                        console.error("Error fetching data:", error); // Error in fetching data
                    }));
        }
    }, [params.id]);

    // Fetch the details of a specific author
    const fetchAuthorDetails = async (authorId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/authors/${authorId}`);
            if (!response.ok) {
                console.error("Error retrieving author"); // Error in retrieving the author
                return;
            }
            const data = await response.json();
            console.log(data);
            setAuthor(data);
            setEditFormData({ first_name: data.first_name, last_name: data.last_name, photo: data.photo, biography: data.biography }); // Set data for editing
        } catch (error) {
            console.error("Error:", error); // General error
        }
    };

    // Fetch the books by a specific author
    const fetchBooksByAuthor = async (authorId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/books/author/${authorId}`);
            if (!response.ok) {
                console.error("Error retrieving books"); // Error in retrieving the books
                return;
            }
            const data: Book[] = await response.json();
            setBooks(data);  // Update the books list for the author
        } catch (error) {
            console.error("Error:", error); // General error
        }
    };

    // Modal handling functions
    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // Delete the author
    const handleDeleteAuthor = async () => {
        if (author) {
            try {
                const response = await fetch(`http://localhost:3001/authors/${author.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    console.error("Error deleting the author"); // Error in deleting the author
                    return;
                }
                router.push("/authors"); // Navigate back to authors list after deletion
            } catch (error) {
                console.error("Error:", error); // General error
            }
        }
    };

    // Open delete modal for a book
    const openDeleteBookModal = (book: Book) => {
        setSelectedBook(book);
        setIsDeleteModalBookOpen(true);
    };

    const closeDeleteBookModal = () => {
        setIsDeleteModalBookOpen(false);
        setSelectedBook(null);
    };

    // Delete a specific book
    const handleDeleteBook = async () => {
        if (selectedBook) {
            try {
                const response = await fetch(`http://localhost:3001/books/${selectedBook.id}`, {
                    method: "DELETE",
                });
                if (!response.ok) {
                    console.error("Error deleting the book"); // Error in deleting the book
                    return;
                }
                setBooks(books.filter(book => book.id !== selectedBook.id)); // Update the books list by removing the deleted book
                closeDeleteModal();
                router.push("/authors");
            } catch (error) {
                console.error("Error:", error); // General error
            }
        }
    };

    // Open modal for editing author
    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    // Handle changes in the edit form
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Submit the updated author data
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
                    console.error("Error updating the author"); // Error in updating the author
                    return;
                }
                const updatedAuthor = await response.json();
                setAuthor(updatedAuthor);
                closeEditModal();
            } catch (error) {
                console.error("Error:", error); // General error
            }
        }
    };

    if (!author) return <p>Loading...</p>; // Loading message if author data is not yet fetched

    return (
        <div>
            <PageTitle>Author Details</PageTitle>
            <Breadcrumb links={[{ href: "/", label: "Home" }, { href: "/authors", label: "Author List" }, { href: `/authors/${author.id}`, label: `${author.first_name} ${author.last_name}` }]} />

            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[500px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Options</h1>
                    <button onClick={openEditModal} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-4">Edit this author</button>
                    <button onClick={openDeleteModal} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4">Delete this author</button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="border p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">{author.first_name} {author.last_name}</h2>
                        <img src={author.photo} alt={`${author.first_name} ${author.last_name}`} className="w-32 h-32 mb-4" />
                        <p className="mb-4"><strong>Biography:</strong> {author.biography}</p>

                        <h3 className="text-xl font-semibold mt-6">Books</h3>
                        {books.length > 0 ? (
                            <ul className="list-disc pl-5 mt-2">
                                {books.map(book => (
                                    <li key={book.id} className="mb-2">
                                        <span className="font-medium">{book.title}</span> - {book.year_published} - {book.price}$
                                        <button onClick={() => openDeleteBookModal(book)} className="ml-4 text-red-500 hover:underline">Delete</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2">This author has no books yet.</p>
                        )}
                    </div>
                </main>
            </div>

            {isDeleteModalBookOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this book?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeDeleteBookModal} className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={handleDeleteBook} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete author {author.first_name + " " + author.last_name}?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={closeDeleteModal} className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                            <button onClick={handleDeleteAuthor} className="p-2 bg-red-500 text-white rounded hover:bg-red-600">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Edit Author</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-4">
                                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
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
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
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
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo URL</label>
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
                                <label htmlFor="biography" className="block text-sm font-medium text-gray-700">Biography</label>
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
                                <button onClick={closeEditModal} className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}