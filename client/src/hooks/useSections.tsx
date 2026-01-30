import { useEffect, useState } from "react";
import type { Project } from "../types/project";
import { projectsApi } from "../api/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectsApi.fetchProjects().then(setProjects).catch(console.error);
  }, []);

  const create = async (
    title: string,
    order: number,
    color: string,
    favorites: boolean,
  ) => {
    const temp: Project = {
      id: "temp-" + Date.now(),
      title,
      color,
      favorites,
      order,

      userId: "me",
    };
    setProjects((p) => [...p, temp]);

    try {
      const real = await projectsApi.createProject({ title, color, favorites });
      setProjects((p) => p.map((x) => (x.id === temp.id ? real : x)));
    } catch {
      setProjects((p) => p.filter((x) => x.id !== temp.id));
    }
  };

  const remove = async (id: string) => {
    const snapshot = projects;
    setProjects((p) => p.filter((x) => x.id !== id));

    try {
      await projectsApi.deleteProject(id);
    } catch {
      setProjects(snapshot);
    }
  };

  const toggleFavorite = async (id: string, favorites: boolean) => {
    const snapshot = projects;
    setProjects((p) => p.map((x) => (x.id === id ? { ...x, favorites } : x)));

    try {
      await projectsApi.updateProject(id, { favorites });
    } catch {
      setProjects(snapshot);
    }
  };

  const update = async (id: string, data: Partial<Project>) => {
    const snapshot = projects;
    setProjects((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));

    try {
      await projectsApi.updateProject(id, data);
    } catch {
      setProjects(snapshot);
    }
  };

  return {
    projects,

    createProject: create,
    deleteProject: remove,
    updateProject: update,
    toggleFavorite,
  };
}
