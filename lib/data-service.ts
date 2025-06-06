// Data service for fetching external JSON data
export interface CommunityCard {
  id: number;
  image: string;
  title: string;
  author: string;
  avatar: string;
  likes: number;
  comments: number;
  appIcon: string;
  category: string;
}

export interface SidebarProfile {
  id: number;
  type: "icon" | "text";
  icon?: string;
  label?: string;
  bg: string;
  color: string;
  name: string;
  projectCount: number;
}

export interface ProjectFile {
  id: number;
  image: string;
  type: string;
  orientation: string;
}

export interface Project {
  id: number;
  title: string;
  fileCount: number;
  lastUpdated: string;
  isLive: boolean;
  files: ProjectFile[];
}

export interface FileDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  tags: string[];
  type: "image" | "video" | "animation";
  category: string;
  createdAt: string;
  project?: string;
}

export interface User {
  id: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  role?: string;
}

// Import data from TypeScript files
import { communityCardsData } from "./data/community-cards";
import { sidebarProfilesData } from "./data/sidebar-profiles";
import { projectsData } from "./data/projects";
import { fileDetailsData } from "./data/file-details";
import { navigationItemsData } from "./data/navigation-items";
import { usersData } from "./data/users";

class DataService {
  async getCommunityCards(): Promise<CommunityCard[]> {
    return Promise.resolve(communityCardsData);
  }

  async getSidebarProfiles(): Promise<SidebarProfile[]> {
    return Promise.resolve(sidebarProfilesData);
  }

  async getProjects(): Promise<Record<string, Project[]>> {
    return Promise.resolve(projectsData);
  }

  async getFileDetails(): Promise<Record<string, FileDetail>> {
    return Promise.resolve(fileDetailsData);
  }

  async getNavigationItems(): Promise<string[]> {
    return Promise.resolve(navigationItemsData);
  }

  async getUsers(): Promise<User[]> {
    return Promise.resolve(usersData);
  }

  async getFileById(id: string): Promise<FileDetail | null> {
    const fileDetails = await this.getFileDetails();
    return fileDetails[id] || null;
  }

  async getProjectsByName(projectName: string): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects[projectName] || [];
  }

  async getFilteredCards(filter: string): Promise<CommunityCard[]> {
    const cards = await this.getCommunityCards();

    if (filter === "Trending") {
      return cards.sort((a, b) => b.likes - a.likes);
    }

    return cards.filter((card) => card.category === filter);
  }

  async searchFiles(query: string, limit: number = 8): Promise<FileDetail[]> {
    if (!query.trim()) {
      return [];
    }

    const fileDetails = await this.getFileDetails();
    const files = Object.values(fileDetails);
    const searchTerm = query.toLowerCase();

    // Search with relevance scoring
    const searchResults = files
      .map((file) => {
        let score = 0;

        // Title match (highest priority)
        if (file.title.toLowerCase().includes(searchTerm)) {
          score += 10;
          if (file.title.toLowerCase().startsWith(searchTerm)) {
            score += 5; // Bonus for title starting with search term
          }
        }

        // Author name match
        if (file.author.name.toLowerCase().includes(searchTerm)) {
          score += 8;
        }

        // Category match
        if (file.category.toLowerCase().includes(searchTerm)) {
          score += 6;
        }

        // Tags match
        const tagMatch = file.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm)
        );
        if (tagMatch) {
          score += 5;
        }

        // Description match (lower priority)
        if (file.description.toLowerCase().includes(searchTerm)) {
          score += 3;
        }

        // Username match
        if (file.author.username.toLowerCase().includes(searchTerm)) {
          score += 4;
        }

        return { file, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ file }) => file);

    return searchResults;
  }
}

export const dataService = new DataService();
