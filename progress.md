# Site Progress Overview

## Top-Level Pages

- **Landing Grid (`/`)**
  - 256px square grid driven by `src/squares-data.jsx`.
  - Supports custom content, hover states, images, modal triggers, and navigation flags.
  - Modal stack (`SquareModal`, `MintModal`, `ImageModal`) handles generic info, mint prompts, and image zooms.

- **Burn Hub (`/burn`)**
  - Mirrors landing grid but powered by `src/burn-squares-data.jsx`.
  - Header replaced with a back button (`← back`) leading to the main grid.
  - Squares include:
    - **burn-large-1**: `BurnNotesManager` mock for wallet connection, note selection, seven-word gating, and burn initiation.
    - **burn-large-2**: `BurnLeaderboard` mock with 30-entry table (rank, name/ENS, reveal year, $TIME).
    - Project tiles linking to the reusable `BurnProjectModal` with richer metadata and embedded tweets.
    - Highlighted copy blocks (custom inline styling to emphasize words).

## Key Components

- **`Square.jsx`**
  - Responsive container sized by parent grid cell, supports custom content or text fallback.

- **`BurnNotesManager.jsx`**
  - Mocked wallet connect flow (`window.ethereum`) with toast messaging hooks for future on-chain integration.
  - Manages selected note state, seven-word drafts (7 inputs, commit button), eligible project dropdown, and burn amount entry.

- **`BurnLeaderboard.jsx`**
  - Scrollable Chakra table listing 30 mocked holders. Start year constant for quick adjustments.

- **`BurnProjectModal.jsx`**
  - Displays project metadata (supply, mint status, asset type, contract address with Etherscan link, OpenSea link).
  - Shows compact logo (≤110px) alongside stats.
  - Embeds YouTube or Twitter content via `iframeUrl` or `embedHtml` with script loader safeguards.

- **`SquareModal.jsx`**
  - Shared modal for base grid: image display, iframe embedding, or text fallback.

## Data Files

- **`src/squares-data.jsx`**
  - E2MB landing squares: mix of custom blocks, hover squares, images, countdown references, and navigation triggers.

- **`src/burn-squares-data.jsx`**
  - Burn page squares with explicit IDs, custom content for highlighted text, large component blocks, project navigation, and placeholders for future copy.

- **`src/burn-projects-data.js`**
  - Dataset for project modal: `name`, `image`, `supply`, `mintEnded`, `assetType` (token/NFT/edition), `contractAddress`, `openseaUrl`, `iframeUrl`, and `embedHtml` (clean blockquote snippets).

## Supporting Files

- **`agent.md`**
  - High-level goals/spec notes for E2MB project.
- **`CountdownRenderer.sol`**
  - Solidity contract (still unchanged) for countdown mechanics.
- **Static assets**
  - Images (e.g., `/public/images/*.png`, `/src/images/*`) used by squares and project modals.

## Current Mock/Placeholder Notes

- Wallet connect + note/project data in `BurnNotesManager` are mocked arrays; ready to replace with real provider + contract calls.
- Leaderboard points and reveal years use sample data; hook into Points overlay once available.
- Many burn squares contain empty strings; ready for written narrative.
- `burnProjectDetails` stores placeholder contract addresses; update as you publish verified addresses.

## Next Steps Ideas

- Integrate actual wallet provider (e.g., Wagmi/viem) and contract reads for notes, seven-word status, and eligible burns.
- Wire leaderboard to live Points/queue data.
- Populate burn squares with narrative copy and project descriptions.
- Add real project contract addresses, asset types, and OnChain metadata links.
