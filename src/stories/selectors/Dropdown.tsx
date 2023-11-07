// Dropdown selector component
import React from 'react';

import styles from './Dropdown.module.scss';

interface DropdownProps {
    /** List of available options */
    options: string[];
    /** Function that is called when the selected option changes */
    onOptionChange: (option: string) => void;
}

/**
 * Dropdown, a component that allows the user to select an option from a list
 * @param options
 * @param onOptionChange
 * @constructor
 */
export const Dropdown = (
    {
        options = [],
        onOptionChange = () => {}
    }: Partial<DropdownProps>) => {

    const [selectedOption, setSelectedOption] = React.useState<string>(options[0]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
        onOptionChange(event.target.value);
    };

    return (
        <div className={styles['dropdown']}>
            <select className={styles['dropdown-select']} value={selectedOption} onChange={handleChange}>
            {options.map((option) => (
                <option className={styles['dropdown-option']} value={option} key={option}>{option}</option>
            ))}
        </select>
        </div>
    );
}