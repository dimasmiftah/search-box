'use client';
import { useEffect, useState } from 'react';
import useDebouncedValue from './use-debounce';

interface Item {
  title: string;
  description: string;
}

const DATA = [
  {
    title: 'Test 1',
    description: 'Test 1. Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  },
  {
    title: 'Test 2',
    description: 'Test 2. Vel dicta exercitationem cum deserunt.',
  },
  {
    title: 'Test 3',
    description: 'Test 3. Enim, nemo minima suscipit sunt perspiciatis odit.',
  },
  {
    title: 'Test 4',
    description:
      'Test 4. Beatae animi, odio distinctio modi non obcaecati a fuga deserunt, praesentium iste explicabo architecto.',
  },
  {
    title: 'Test 5',
    description:
      'Test 5. Laborum soluta explicabo, quod doloribus delectus, ab aspernatur, corrupti eligendi earum nam sint itaque rerum dicta.',
  },
];

const highlightParts = (text: string, query: string) => {
  if (!query) return [text];

  const result: Array<string | { match: string }> = [];
  let i = 0;

  while (true) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase(), i);

    if (idx === -1) {
      result.push(text.slice(i));
      break;
    }

    if (idx > i) {
      result.push(text.slice(i, idx));
    }

    result.push({ match: text.slice(idx, idx + query.length) });
    i = idx + query.length;
  }

  return result;
};

export default function Home() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const debouncedQuery = useDebouncedValue(query, 400);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim().toLocaleLowerCase();

    if (!trimmedQuery) {
      return setSearchResults([...DATA]);
    }

    setSearchResults(
      [...DATA]
        .filter(
          (item: Item) =>
            item.title.toLocaleLowerCase().includes(trimmedQuery) ||
            item.description.toLocaleLowerCase().includes(trimmedQuery)
        )
        .map((item) => item)
    );
  };

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery]);

  const renderTextWithHighlight = (text: string) => {
    return highlightParts(text, debouncedQuery).map((part, index) =>
      typeof part === 'string' ? (
        <>{part}</>
      ) : (
        <mark key={index} className='bg-yellow-200'>
          {part.match}
        </mark>
      )
    );
  };

  return (
    <div className='flex flex-col gap-20 min-h-screen items-center bg-zinc-50 font-sans dark:bg-black pt-20'>
      <div className='flex flex-col gap-1'>
        <label className='font-bold' htmlFor='search'>
          Search
        </label>
        <input
          className='border p-2'
          type='text'
          name='search'
          placeholder='Type here...'
          id='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span>
          <b>{searchResults.length} post</b> were found.
        </span>
      </div>
      <ul className='px-10 flex flex-col gap-4 max-w-3xl'>
        {searchResults.length ? (
          searchResults.map((item) => (
            <li key={item.title}>
              <span className='font-bold'>{renderTextWithHighlight(item.title)}</span>
              <p>{renderTextWithHighlight(item.description)}</p>
            </li>
          ))
        ) : (
          <div className='self-center'>Not data found.</div>
        )}
      </ul>
    </div>
  );
}
