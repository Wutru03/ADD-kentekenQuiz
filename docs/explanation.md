# Explanation - Kentekenquiz

**Route:** Own idea. **Tools:** Claude Code

## 1. Your technical choices

<Every choice under "Technical choices" in your `product.md`, one short
paragraph each. Where is it in the code (file and line)? Did it change while
you built? Say what and why.>

*Example: "Favorites live in SQLite (`src/services/favorites-db.ts:12`), not AsyncStorage,
because I want to sort and filter them. The agent proposed AsyncStorage; I
said no."*

## 2. Pick one feature and explain how it works, from API call to screen.

<Which feature. Where the data comes in, where it is stored or cached, how it
reaches the screen, what happens while loading or on error. Name the files.>

*Example: "Favorites. `useFavorites` (`src/hooks/use-favorites.ts`) reads the ids
from SQLite. For each id, `useQuery` fetches the Pokémon through
`src/services/pokeapi.ts`; TanStack caches it, so going back from detail to list does
not reload. `FavoritesScreen` shows a spinner until all are in, and an error
with a retry button if one call fails."*

## 3. Name a suggestion from the agent that you rejected or changed.

<What did the agent suggest? What did you do instead, and why? How did you
notice (reading the diff, testing, your spec)? Point at the chat in
`chat-history/` or the commit.>

*Example: "For the search, the agent wanted to fetch every Pokémon on each
keystroke. I saw it in the plan on issue 2 and said no: I load the name list
once and filter it on the phone (`src/hooks/use-pokemon-list.ts:14`). One
request instead of hundreds. Chat: `chat-history/issue-2.json`."*
