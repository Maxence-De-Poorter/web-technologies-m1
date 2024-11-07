import Breadcrumb from "../../components/Breadcrumb";

export default function BooksPage() {
    return(
        <div>
            <Breadcrumb links={[
                { href: '/books', label: 'Liste des livres' }
            ]} />
            <h1>Liste des livres</h1>;
        </div>
    )
}