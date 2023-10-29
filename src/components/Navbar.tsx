import React from 'react';

type NavItem = {
    name: string;
    url: string;
};

type NavbarProps = {
    items?: NavItem[];
};

const Navbar: React.FC<NavbarProps> = ({ items = [] }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
                {items.map((item, idx) => (
                    <li key={idx} className="nav-item">
                        <a className="nav-link" href={item.url}>{item.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
);

export default Navbar;
