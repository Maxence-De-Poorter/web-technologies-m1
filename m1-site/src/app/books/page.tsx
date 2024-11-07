import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

export default function BooksPage() {
    return(
        <div>
            <PageTitle>Liste des livres</PageTitle>
            <Breadcrumb links={[
                { href: '/', label: 'Accueil' },
                { href: '/books', label: 'Liste des livres' }
            ]} />
        </div>
    )
}