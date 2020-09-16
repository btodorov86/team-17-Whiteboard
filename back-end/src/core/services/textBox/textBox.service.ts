import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Whiteboard } from 'src/models/whiteboard/whiteboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TextBox } from 'src/models/textBox/textBox.entity';
import { ReturnTextBoxDTO } from 'src/models/textBox/return.textBox.dto';
import { CreateTextBoxDTO } from 'src/models/textBox/create.textBox.dto';

@Injectable()
export class TextBoxService {
  constructor(
    @InjectRepository(Whiteboard)
    private readonly whiteboardsRepo: Repository<Whiteboard>,
    @InjectRepository(TextBox)
    private readonly textBoxRepo: Repository<TextBox>,
  ) {}

  async create(
    whiteboardId: string,
    body: CreateTextBoxDTO,
  ): Promise<ReturnTextBoxDTO> {
    const whiteboard = await this.whiteboardsRepo.findOne({
      where: { id: whiteboardId, isDeleted: false },
      relations: ['textBoxes'],
    });

    if (!whiteboard) {
      throw new NotFoundException();
    }

    const newTextBox = await this.textBoxRepo.save({
      itemPosition: whiteboard.textBoxes.length + 1,
      x: body.x,
      y: body.y,
      fill: body.fill,
      text: body.text,
      fontStyle: body.fontStyle,
      textDecoration: body.textDecoration,
      fontSize: body.fontSize,
    });

    whiteboard.textBoxes.push(newTextBox);

    await this.whiteboardsRepo.save(whiteboard);

    return newTextBox;
  }
  async update(
    whiteboardId: string,
    body: Partial<CreateTextBoxDTO>,
    TextBoxId: string,
  ): Promise<ReturnTextBoxDTO> {
    const whiteboard = await this.whiteboardsRepo.findOne({
      where: { id: whiteboardId, isDeleted: false },
      relations: ['textBoxes'],
    });
    if (!whiteboard) {
      throw new NotFoundException();
    }

    const TextBox = await this.textBoxRepo.findOne({
      where: { id: TextBoxId, isDeleted: false },
    });

    if (!TextBox) {
      throw new NotFoundException();
    }
    return await this.textBoxRepo.save({
      ...TextBox,
      ...body,
    });
  }
  async delete(TextBoxId: string): Promise<string> {
    const TextBox = await this.textBoxRepo.findOne({
      where: { id: TextBoxId, isDeleted: false },
    });
    if (!TextBox) {
      throw new NotFoundException();
    }

    TextBox.isDeleted = true;

    return 'item is Deleted';
  }
}
