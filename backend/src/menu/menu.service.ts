import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Menu } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getAllMenus(): Promise<Menu[]> {
    return this.prisma.menu.findMany();
  }

  async createMenu(createMenuDto: { label: string; parentId?: number }) {
    return this.prisma.menu.create({
      data: {
        label: createMenuDto.label,
        parentId: createMenuDto.parentId || null,
      },
    });
  }

  async updateMenu(
    id: number,
    updateMenuDto: { label?: string; parentId?: number },
  ) {
    // Check if the menu item exists
    const numericId = Number(id);
    const menu = await this.prisma.menu.findUnique({
      where: { id: numericId },
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // Update the menu item
    return this.prisma.menu.update({
      where: { id: numericId },
      data: {
        label: updateMenuDto.label,
        parentId: updateMenuDto.parentId || null,
      },
    });
  }

  async deleteMenu(id: number): Promise<{ message: string }> {
    // Convert id to a number if it's not already
    const numericId = Number(id);

    // Check if the menu item exists
    const menu = await this.prisma.menu.findUnique({
      where: { id: numericId },
    });
    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    // Delete the menu item
    await this.prisma.menu.delete({ where: { id: numericId } });

    return { message: `Menu with ID ${id} successfully deleted` };
  }
}
