import type { Project } from "../data-service"

export const projectsData: Record<string, Project[]> = {
  "Nike Space": [
    {
      id: 1,
      title: "New Nike Graphic",
      fileCount: 6,
      lastUpdated: "5 mins ago",
      isLive: true,
      files: [
        { id: 1, image: "https://picsum.photos/seed/nike1/300/400", type: "vertical", orientation: "portrait" },
        {
          id: 2,
          image: "https://picsum.photos/seed/nike2/400/250",
          type: "horizontal",
          orientation: "landscape",
        },
        { id: 3, image: "https://picsum.photos/seed/nike3/200/200", type: "square", orientation: "square" },
        { id: 4, image: "https://picsum.photos/seed/nike4/200/200", type: "square", orientation: "square" },
      ],
    },
    {
      id: 2,
      title: "Instagram Story",
      fileCount: 5,
      lastUpdated: "5 mins ago",
      isLive: true,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/insta1/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        {
          id: 2,
          image: "https://picsum.photos/seed/insta2/250/350",
          type: "vertical",
          orientation: "portrait",
        },
        { id: 3, image: "https://picsum.photos/seed/insta3/200/200", type: "square", orientation: "square" },
        { id: 4, image: "https://picsum.photos/seed/insta4/300/400", type: "vertical", orientation: "portrait" },
      ],
    },
    {
      id: 3,
      title: "Product Showcase",
      fileCount: 8,
      lastUpdated: "2 hours ago",
      isLive: false,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/product1/400/250",
          type: "horizontal",
          orientation: "landscape",
        },
        {
          id: 2,
          image: "https://picsum.photos/seed/product2/300/400",
          type: "vertical",
          orientation: "portrait",
        },
        { id: 3, image: "https://picsum.photos/seed/product3/200/200", type: "square", orientation: "square" },
        {
          id: 4,
          image: "https://picsum.photos/seed/product4/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
      ],
    },
  ],
  "Spacetwo Studio": [
    {
      id: 4,
      title: "Brand Identity",
      fileCount: 12,
      lastUpdated: "1 hour ago",
      isLive: false,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/brand1/250/350",
          type: "vertical",
          orientation: "portrait",
        },
        {
          id: 2,
          image: "https://picsum.photos/seed/brand2/400/250",
          type: "horizontal",
          orientation: "landscape",
        },
        { id: 3, image: "https://picsum.photos/seed/brand3/200/200", type: "square", orientation: "square" },
        { id: 4, image: "https://picsum.photos/seed/brand4/200/200", type: "square", orientation: "square" },
      ],
    },
    {
      id: 5,
      title: "Website Redesign",
      fileCount: 15,
      lastUpdated: "3 hours ago",
      isLive: true,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/web1/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        {
          id: 2,
          image: "https://picsum.photos/seed/web2/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        { id: 3, image: "https://picsum.photos/seed/web3/250/350", type: "vertical", orientation: "portrait" },
      ],
    },
  ],
  "Photoshop Projects": [
    {
      id: 6,
      title: "Photo Manipulation",
      fileCount: 10,
      lastUpdated: "30 mins ago",
      isLive: true,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/photo1/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        {
          id: 2,
          image: "https://picsum.photos/seed/photo2/300/400",
          type: "vertical",
          orientation: "portrait",
        },
        { id: 3, image: "https://picsum.photos/seed/photo3/200/200", type: "square", orientation: "square" },
        {
          id: 4,
          image: "https://picsum.photos/seed/photo4/400/250",
          type: "horizontal",
          orientation: "landscape",
        },
      ],
    },
    {
      id: 7,
      title: "Digital Art",
      fileCount: 7,
      lastUpdated: "1 hour ago",
      isLive: false,
      files: [
        { id: 1, image: "https://picsum.photos/seed/art1/250/350", type: "vertical", orientation: "portrait" },
        {
          id: 2,
          image: "https://picsum.photos/seed/art2/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        { id: 3, image: "https://picsum.photos/seed/art3/200/200", type: "square", orientation: "square" },
      ],
    },
  ],
  "Design System": [
    {
      id: 8,
      title: "Component Library",
      fileCount: 25,
      lastUpdated: "2 hours ago",
      isLive: true,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/comp1/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        { id: 2, image: "https://picsum.photos/seed/comp2/300/400", type: "vertical", orientation: "portrait" },
        { id: 3, image: "https://picsum.photos/seed/comp3/200/200", type: "square", orientation: "square" },
        {
          id: 4,
          image: "https://picsum.photos/seed/comp4/400/250",
          type: "horizontal",
          orientation: "landscape",
        },
      ],
    },
  ],
  "Open Source": [
    {
      id: 9,
      title: "UI Kit",
      fileCount: 18,
      lastUpdated: "4 hours ago",
      isLive: false,
      files: [
        {
          id: 1,
          image: "https://picsum.photos/seed/ui1/400/300",
          type: "horizontal",
          orientation: "landscape",
        },
        { id: 2, image: "https://picsum.photos/seed/ui2/250/350", type: "vertical", orientation: "portrait" },
        { id: 3, image: "https://picsum.photos/seed/ui3/200/200", type: "square", orientation: "square" },
      ],
    },
  ],
}
