'use client';
import './App.css';
import PageTitle from "../components/PageTitle";

export default function HomePage(){
    return(
        <div>
            <PageTitle>Accueil</PageTitle>
            <main className="p-2">
                <section className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Bienvenue sur notre gestionnaire de livres et d'auteurs</h1>
                    <p className="text-lg mb-4">
                        Ce projet a été réalisé dans le cadre de notre Master 1. Il permet de gérer une bibliothèque de
                        livres et d'auteurs de manière efficace et intuitive.
                    </p>
                    <img
                        src="https://imgs.search.brave.com/JOwFLI-cuVgpkqwaidA1LfT73JIql31UCHzO0dg-Tmk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cGhvdG9zLXByZW1p/dW0vYmlibGlvdGhl/cXVlLW51bWVyaXF1/ZS1mdXR1cmlzdGUt/ZXR1ZGlhbnRzLXF1/aS1mb250LXJlY2hl/cmNoZXNfMTMyNDc4/NS03MTk1Ni5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw"
                        alt="Bibliothèque" className="mx-auto mb-8"/>
                </section>
                <section className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Fonctionnalités principales</h2>
                    <ul className="list-disc list-inside">
                        <li>Ajouter, modifier et supprimer des livres</li>
                        <li>Ajouter, modifier et supprimer des auteurs</li>
                        <li>Consulter les détails des livres et des auteurs</li>
                        <li>Rechercher des livres par auteur</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}