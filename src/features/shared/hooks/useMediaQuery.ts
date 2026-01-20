import { useEffect, useState } from 'react';

export const useMediaQuery = (query: string) => {
    const getMatches = () => window.matchMedia(query).matches;

    const [matches, setMatches] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return getMatches();
        }
        return false;
    });

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const listener = () => setMatches(mediaQueryList.matches);

        listener();
        mediaQueryList.addEventListener('change', listener);

        return () => mediaQueryList.removeEventListener('change', listener);
    }, [query]);

    return matches;
};
