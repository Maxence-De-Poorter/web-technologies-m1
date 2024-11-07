import Breadcrumb from "../../components/Breadcrumb";
import PageTitle from "../../components/PageTitle";

export default function AuthorsPage() {
    return (
        <div>
            <PageTitle>Liste des auteurs</PageTitle>
            <Breadcrumb links={[
                { href: '/', label: 'Accueil' },
                {href: '/authors', label: 'Liste des auteurs'}
            ]}/>
        </div>
    )
}