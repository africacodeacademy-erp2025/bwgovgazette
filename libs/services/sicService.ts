import { prisma } from "../prisma";
import { SicLevel } from "@prisma/client";

/* ─────────────────────────────────────────────
   Shared field selection
───────────────────────────────────────────── */

const SIC_NODE_FIELDS = {
  id: true,
  code: true,
  title: true,
  description: true,
  level: true,
  parentId: true,
} as const;

/* ─────────────────────────────────────────────
   Return types
───────────────────────────────────────────── */

export type SicNodeBase = {
  id: string;
  code: string | null;
  title: string | null;
  description: string | null;
  level: SicLevel;
  parentId: string | null;
};

export type ClassNode = SicNodeBase;

export type GroupNode = SicNodeBase & {
  classes: ClassNode[];
};

export type DivisionNode = SicNodeBase & {
  groups: GroupNode[];
};

export type IndustryNode = SicNodeBase & {
  divisions: DivisionNode[];
};

/* ─────────────────────────────────────────────
   SicService
───────────────────────────────────────────── */

export class SicService {
  /**
   * Returns all active SicNode children of the given parent, ordered by code.
   * Returns an empty array if none exist.
   */
  private async getChildren(parentId: string): Promise<SicNodeBase[]> {
    return prisma.sicNode.findMany({
      where: {
        parentId,
        isActive: true,
      },
      select: SIC_NODE_FIELDS,
      orderBy: { code: "asc" },
    });
  }

  /**
   * Returns all top-level industry nodes.
   */
  async getIndustries(): Promise<SicNodeBase[]> {
    return prisma.sicNode.findMany({
      where: {
        level: SicLevel.industry,
        isActive: true,
      },
      select: SIC_NODE_FIELDS,
      orderBy: { code: "asc" },
    });
  }

  /**
   * Returns all division nodes that belong to the given industry.
   */
  async getDivisionsByIndustry(industryId: string): Promise<SicNodeBase[]> {
    return this.getChildren(industryId);
  }

  /**
   * Returns all group nodes that belong to the given division.
   */
  async getGroupsByDivision(divisionId: string): Promise<SicNodeBase[]> {
    return this.getChildren(divisionId);
  }

  /**
   * Returns all class nodes that belong to the given group.
   */
  async getClassesByGroup(groupId: string): Promise<SicNodeBase[]> {
    return this.getChildren(groupId);
  }

  /**
   * Returns a fully nested 4-level hierarchy tree for the given industry.
   * Industry → Divisions → Groups → Classes
   */
  async getIndustryHierarchy(industryId: string): Promise<IndustryNode | null> {
    const industry = await prisma.sicNode.findFirst({
      where: {
        id: industryId,
        level: SicLevel.industry,
        isActive: true,
      },
      select: SIC_NODE_FIELDS,
    });

    if (!industry) return null;

    const divisions = await this.getDivisionsByIndustry(industryId);

    const divisionsWithGroups: DivisionNode[] = await Promise.all(
      divisions.map(async (division) => {
        const groups = await this.getGroupsByDivision(division.id);

        const groupsWithClasses: GroupNode[] = await Promise.all(
          groups.map(async (group) => {
            const classes = await this.getClassesByGroup(group.id);
            return { ...group, classes };
          }),
        );

        return { ...division, groups: groupsWithClasses };
      }),
    );

    return { ...industry, divisions: divisionsWithGroups };
  }
}

export const sicService = new SicService();
