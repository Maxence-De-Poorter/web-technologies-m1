import Link from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';

type BreadcrumbLink = {
    href: string;
    label: string;
};

interface BreadcrumbProps {
    links: BreadcrumbLink[];
}

const Breadcrumb = ({ links }: BreadcrumbProps) => (
    <Breadcrumbs aria-label="breadcrumb" className="my-4">
        {links.map((link, index) => (
            <Link key={index} href={link.href} passHref>
                {link.label}
            </Link>
        ))}
    </Breadcrumbs>
);

export default Breadcrumb;