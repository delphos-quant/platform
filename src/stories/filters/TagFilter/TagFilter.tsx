import React, {useEffect} from 'react';

import styles from './TagFilter.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

interface TagFilterProps {
    /** Placeholder text for the input box */
    placeholder: string;
    /** List of available or suggested tags */
    availableTags: string[];
    /** If true, only tags from the list of available tags can be selected */
    fixedTags: boolean;
    /** If true, only one tag of each type can be selected */
    uniqueTags: boolean;
    /** Function that is called when the list of selected tags changes */
    onTagsChange: (tags: string[]) => void;
    /** Background color of the component */
    backgroundColor: string;
}

/**
 * TagFilter, a component that allows the user to filter tags and selectors them
 * @param placeholder
 * @param availableTags
 * @param fixedTags
 * @param uniqueTags
 * @param onTagsChange
 * @param backgroundColor
 * @constructor
 */
export const TagFilter = (
    {
        placeholder = '',
        availableTags = [],
        fixedTags = true,
        uniqueTags = true,
        onTagsChange = () => {},
        backgroundColor = '#FFFFFF'
    }: Partial<TagFilterProps>
) => {
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    const [filterTags, setFilterTags] = React.useState(availableTags);
    const [input, setInput] = React.useState('');

    useEffect(() => {
        // If unique tags is true, don't show tags that are already selected
        updateFilter();
    }, [input]);

    useEffect(() => {
        updateFilter();
        onTagsChange(selectedTags);
    }, [selectedTags]);

    const updateFilter = () => {
        if (uniqueTags) {
            if (input === '') {
                setFilterTags(availableTags.filter((tag) => !selectedTags.includes(tag)));
                return;
            }
            const filteredTags = availableTags.filter((tag) => tag.includes(input) && !selectedTags.includes(tag));
            setFilterTags(filteredTags);
            return;
        }

        const filteredTags = availableTags.filter((tag) => tag.includes(input));
        setFilterTags(filteredTags);
    }

    const addTag = (tag: string) => {
        if (tag === '') {
            return;
        }
        if (uniqueTags && selectedTags.includes(tag)) {
            return;
        }
        if (!fixedTags) {
            setSelectedTags([...selectedTags, tag]);
        } else {
            if (availableTags.includes(tag)) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    }

    const removeTag = (tag: string) => {
        const index = selectedTags.indexOf(tag);
        if (index > -1) {
            setSelectedTags(selectedTags.filter((_, i) => i !== index));
        }
    }

    const handleSuggestionClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const tag = event.currentTarget.innerText;
        addTag(tag);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let new_input = event.target.value;

        setInput(new_input);
        // If input has commas, add tags
        if (new_input.includes(',')) {
            const tags = new_input.split(',');
            tags.forEach((tag) => {
                addTag(tag);
            });
            setInput('');
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // If input is empty and backspace is pressed, remove last tag
        if (event.key === 'Backspace' && input === '') {
            const lastTag = selectedTags[selectedTags.length - 1];
            removeTag(lastTag);
        }
        else if (event.key === 'Enter') {
            addTag(input);
            setInput('');
        }
    }

    return (
        <div className={styles['tag-filter']} style={{ backgroundColor: backgroundColor }}>
            <div className={styles['tag-container']}>
                {selectedTags.map((tag) => (
                    <span className={styles['tag-box']}>
                        {tag}
                        <span className={styles['tag-close']} onClick={() => removeTag(tag)}> <AiOutlineClose /> </span>
                    </span>
                ))}
                <input className={styles['tag-input']} type='text' placeholder={placeholder} onChange={handleInputChange} onKeyUp={handleKeyPress} value={input}/>
            </div>
            <div className={styles['tag-suggestions']}>
                <ul>
                    {filterTags && filterTags.map((tag) => (
                        <li onClick={handleSuggestionClick}>{tag}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};