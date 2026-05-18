# Riječki Puls: An Artificial Intelligence-Driven Urban Event Aggregation and Structuring System

**Author Information**
Independent Researcher
AI Studio Build Project Group
Date: May 18, 2026

---

## Abstract

This report examines "Riječki Puls," a full-stack web application designed to solve the problem of fragmented urban event information in Rijeka, Croatia. Utilizing Large Language Models (LLMs), specifically Google’s Gemini 1.5 Pro, and real-time search grounding, the system automates the extraction of unstructured event data from disparate digital sources. The findings demonstrate that by integrating natural language processing with a modern responsive interface, urban information silos can be bridged, providing residents with a centralized, verified, and time-accurate cultural dashboard.

---

## Introduction

In the modern digital landscape, information regarding local cultural and social events is often scattered across diverse platforms, including social media threads, official tourism portals, and local news outlets. This fragmentation leads to a significant cognitive load for residents attempting to navigate the city’s offerings. "Riječki Puls" was conceptualized as a centralized "AI Central" for events in Rijeka, aimed at leveraging autonomous data extraction to provide a cohesive urban narrative. The project aligns with the city's branding as "Grad koji teče" (The City that Flows) and seeks to foster community engagement through technological accessibility.

---

## Method

### System Architecture
The application employs a robust full-stack architecture:
- **Frontend:** Built with React 18+ and Vite, utilizing Tailwind CSS for a modern "Bento Grid" design aesthetic. Framer Motion is integrated to provide fluid micro-animations, enhancing user experience.
- **Backend:** A Node.js Express server acts as a secure proxy to the Gemini API, ensuring sensitive API keys remain server-side.
- **AI Core:** The system utilizes the `@google/genai` SDK, specifically the Gemini 1.5 Pro model.

### Data Acquisition Strategies
Two primary modes of data acquisition were implemented:
1.  **Heuristic Extraction:** A manual mode where users can input raw, unstructured text. The LLM is prompted with a specific JSON schema to extract variables such as `eventName`, `date`, `venue`, `category`, `description`, and `source`.
2.  **Autonomous Web Grounding:** Utilizing the `googleSearch` tool within the Gemini model parameters, the system performs real-time searches of trusted local domains (e.g., visitrijeka.hr, mojekarte.hr) to identify upcoming events and verify details against current temporal data.

---

## Design and Features

### Bento Grid Interface
Following modern product design principles, the application utilizes a non-linear grid layout. This allows for high information density while maintaining legibility. The use of "Outfit" for general UI and "Space Grotesk" for display typography provides a tech-forward yet accessible visual identity.

### Temporal Navigation
A horizontal scroll-based calendar component allows users to filter events by proximity. This is critical for urban planning on an individual level, enabling users to synchronize their personal schedules with the city’s "pulse."

### Data Integrity and Verification
Each event card displays a source attribution URL. This design choice addresses the "hallucination" risk common in LLMs by providing a direct link back to the originating announcement, thereby grounding the AI's output in verifiable reality.

---

## Results and Discussion

The implementation of "Riječki Puls" successfully demonstrates that AI can do more than generate text; it can act as a sophisticated structural layer for urban data. The system’s ability to parse ambiguous phrases (e.g., "next Friday") into absolute timestamps (DD.MM.YYYY) significantly reduces user error in date tracking.

### Future Developments
Further iterations of the system are proposed to include:
- **Mobility Integration:** Real-time API connections with Jadrolinija (ferries) and local ride-sharing services (Uber/Bolt) to facilitate transport planning directly from event details.
- **Institutional Collaboration:** Partnership with the Startup Incubator Energana's AI Lab to refine the extraction algorithms using local linguistic nuances.
- **Push Notifications:** Utilizing browser-based service workers to alert users of "trending" events based on search volume or social mentions.

---

## Conclusion

Riječki Puls serves as a prototype for the next generation of smart city applications. By moving beyond simple RSS feeds and into AI-mediated data extraction, the application provides a blueprint for how medium-sized cities can centralize their cultural offerings effectively. The project proves that when high-tech AI is paired with intentional, localized frontend design, it creates a powerful tool for community synchronization.

---

## References

1. Google DeepMind. (2024). *Gemini 1.5 Pro: Next-generation multimodal model.*
2. React Documentation. (2024). *Functional Components and Hooks.*
3. Tailwind Labs. (2024). *Utility-First CSS Design.*
4. City of Rijeka. (2026). *Cultural and Industrial Heritage Branding Guidelines.*
