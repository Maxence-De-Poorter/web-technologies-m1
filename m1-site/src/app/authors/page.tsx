"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

type Author = {
    id: string;
    first_name: string;
    last_name: string;
    photo: string;
    biography: string;
    bookCount: number;
};

export default function AuthorsPage() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [searchName, setSearchName] = useState("");
    const [minBookCount, setMinBookCount] = useState<number | "">("");
    const [sortOrder, setSortOrder] = useState("ASC"); // Nouvel état pour l'ordre de tri
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAuthor, setNewAuthor] = useState({ first_name: "", last_name: "", photo: "", biography: "" });

    const fetchAuthors = async (name = "", minBooks = "", order = "ASC") => {
        try {
            const query = new URLSearchParams();
            if (name) query.append("name", name);
            if (minBooks) query.append("minBooks", minBooks.toString());
            query.append("order", order); // Ajouter le paramètre d'ordre

            const response = await fetch(`http://localhost:3001/authors?${query.toString()}`);
            if (!response.ok) {
                console.error("Erreur lors de la récupération des auteurs");
                return;
            }
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    const handleCreateAuthor = async () => {
        try {
            const response = await fetch("http://localhost:3001/authors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAuthor),
            });
            if (!response.ok) {
                console.error("Erreur lors de la création de l'auteur");
            }
            setIsModalOpen(false);
            setNewAuthor({ first_name: "", last_name: "", photo: "", biography:"" });
            await fetchAuthors(); // Rafraîchit la liste des auteurs
        } catch (error) {
            console.error("Erreur:", error);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleApplyFilters = () => {
        fetchAuthors(searchName, minBookCount, sortOrder);
    };

    return (
        <div>
            <PageTitle>Liste des auteurs</PageTitle>
            <Breadcrumb links={[
                { href: "/", label: "Accueil" },
                { href: "/authors", label: "Liste des auteurs" },
            ]} />

            {/* Modal de création d'auteur */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Créer un nouvel auteur</h2>
                        <input
                            type="text"
                            placeholder="Prénom"
                            value={newAuthor.first_name}
                            onChange={(e) => setNewAuthor({...newAuthor, first_name: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newAuthor.last_name}
                            onChange={(e) => setNewAuthor({...newAuthor, last_name: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="URL de la photo"
                            value={newAuthor.photo}
                            onChange={(e) => setNewAuthor({...newAuthor, photo: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="biographie"
                            value={newAuthor.photo}
                            onChange={(e) => setNewAuthor({...newAuthor, biography: e.target.value})}
                            className="w-full p-2 mb-4 border border-gray-300 rounded"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreateAuthor}
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex h-screen w-full">
                <aside className="w-1/4 p-4 bg-gray-100 shadow-md mt-4 max-h-[500px] rounded-lg">
                    <h1 className="text-center font-semibold text-xl">Filtres</h1>

                    <input
                        type="text"
                        placeholder="Rechercher par nom"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="w-full p-2 my-4 border border-gray-300 rounded"
                    />

                    <input
                        type="number"
                        placeholder="Nombre minimum de livres"
                        value={minBookCount}
                        onChange={(e) => setMinBookCount(e.target.value ? parseInt(e.target.value) : "")}
                        className="w-full p-2 my-4 border border-gray-300 rounded"
                    />

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded bg-white"
                    >
                        <option value="ASC">Ordre Alphabétique</option>
                        <option value="DESC">Ordre Inverse</option>
                    </select>

                    <button
                        onClick={handleApplyFilters}
                        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
                    >
                        Appliquer les filtres
                    </button>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Ajouter un nouvel auteur
                    </button>
                </aside>

                <main className="w-3/4 p-6 overflow-y-auto bg-white">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {authors.map((author) => (
                            <Link key={author.id} href={`/authors/${author.id}`}>
                                <div className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100">
                                    <img src={author.photo} alt={`${author.first_name} ${author.last_name}`}
                                         className="w-full h-32 object-contain rounded-full mb-4"/>
                                    <h2 className="text-lg font-semibold">{author.first_name} {author.last_name}</h2>
                                    <p>Nombre de livres : {author.bookCount}</p>
                                    <p>Biographie : {author.biography}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}