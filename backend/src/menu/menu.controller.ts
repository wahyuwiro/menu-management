import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from '@prisma/client';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getAllMenus(): Promise<Menu[]> {
    return this.menuService.getAllMenus(); // Call the service method to fetch menus
  }

  @Get(':id')
  getMenuById(@Param('id') id: string) {
    return { message: `This will return menu with ID ${id}.` };
  }

  @Post()
  async createMenu(
    @Body() createMenuDto: { label: string; parentId?: number },
  ) {
    const newMenu = await this.menuService.createMenu(createMenuDto);
    return { message: 'Menu created!', data: newMenu };
  }

  @Patch(':id')
  async editMenu(
    @Param('id') id: number,
    @Body() updateMenuDto: { label?: string; parentId?: number },
  ) {
    const updatedMenu = await this.menuService.updateMenu(id, updateMenuDto);
    return { message: 'Menu updated!', data: updatedMenu };
  }

  @Delete(':id')
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(Number(id)); // Convert string id to number
  }
}
