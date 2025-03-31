
# Ghost - ZK Notary Agent

![Ghost](./public/ghost-icon.svg)

A Zero-Knowledge Proof system for private attestations on the Internet Computer.

## 🎯 Milestone 1: MVP - Core Proof System

This project has successfully completed Milestone 1, which involved creating a minimum viable product (MVP) for a Zero-Knowledge Proof (ZKP) system that enables private attestations on the Internet Computer.

### Deliverables

✅ **Canister-based ZK Proof System:**
- Implemented a Web UI interface to the ZK Proof canister on the Internet Computer
- Successfully integrated with the canister ID: `hi7bu-myaaa-aaaad-aaloa-cai`
- Enables generating and verifying Zero-Knowledge Proofs for token ownership

✅ **Simple Frontend for Proof Requests:**
- Created an intuitive web interface where users can:
  - Connect their Internet Computer wallet
  - Generate a ZK proof for token ownership
  - Access a shareable verification link

✅ **Anonymous Reference Generation:**
- Each generated proof produces a unique, shareable link
- Third parties can verify proof validity without revealing the user's identity or token details
- Proof links maintain privacy while confirming attestations

✅ **End-to-End Testing:**
- Implemented a comprehensive test suite that validates:
  - Proof generation
  - Proof verification by the original wallet
  - Anonymous verification via shareable links

### Definition of Done

Each deliverable has been verified to meet its success criteria:

1. **ZK Proof System:** The system successfully interfaces with the Internet Computer canister to generate valid Zero-Knowledge Proofs based on user input.

2. **Frontend Interface:** Users can seamlessly connect their wallet, select their token, and request a ZK proof through an intuitive UI.

3. **Anonymous References:** Each proof generates a unique, shareable verification link that maintains privacy while enabling third-party verification.

4. **Testing:** The system includes a test suite that validates the complete proof lifecycle from generation to verification.

## 🧪 ZK Canister

While not part of this repository, this application interfaces with the Zero-Knowledge Proof canister deployed on the Internet Computer.

### Canister Details

- **Canister ID:** `hi7bu-myaaa-aaaad-aaloa-cai`
- **Network:** Internet Computer Mainnet

### Canister Capabilities

The ZK canister provides the following functionality:

- **Proving Ownership:** Generates cryptographic proofs that verify a user possesses or owns specific tokens without revealing the token identity or balance details
- **Verification:** Allows any party to verify the validity of a proof without learning the underlying token information
- **Privacy Preservation:** Maintains complete privacy of token details while providing attestation capabilities

The canister uses advanced cryptographic techniques to create Zero-Knowledge Proofs that enable selective disclosure - users can prove properties about their tokens without revealing any other information.

## 👤 User Flow

1. **Connect Wallet**
   - User visits the application and connects their Internet Computer wallet
   - Application requests necessary permissions to read token balances

2. **Generate Proof**
   - User selects a token for which they want to generate a proof
   - User clicks "Generate ZK Proof" button
   - Application communicates with the ZK canister to create the proof
   - Upon success, a shareable verification link is generated

3. **Share Proof**
   - User receives a unique proof link that can be shared with any third party
   - The link contains a reference to the proof but reveals no private information

4. **Verify Proof**
   - Third party accesses the verification link
   - Application anonymously verifies the proof's validity with the ZK canister
   - Verification result is displayed without revealing the token details

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone this repository:
   ```
   git clone <your-repository-url>
   cd ghost-zk-notary
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## 🔮 Future Work (Milestone 2)

The next milestone will focus on enhancing the system with:

- AI-based proof summarization
- Enhanced verification interfaces
- Additional use cases beyond token ownership
- Expanded documentation and community resources

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
