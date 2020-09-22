import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    userId: string,
  ): Promise<ReturnTextBoxDTO> {
    const whiteboard = await this.whiteboardsRepo.findOne({
      where: { id: whiteboardId, isDeleted: false },
      relations: ['lines', 'circles', 'rectangles', 'author', 'textBoxes', 'invitedUsers'],
    });

    if (!whiteboard) {
      throw new NotFoundException();
    }

      if (!whiteboard.isPublic && userId !== whiteboard.author.id && !whiteboard.invitedUsers.find(x => x.id === userId)) {
        throw new UnauthorizedException();
    }


  const currentPosition = whiteboard.circles.length + whiteboard.lines.length + whiteboard.rectangles.length + whiteboard.textBoxes.length;

    const newTextBox = await this.textBoxRepo.save({
      itemPosition: currentPosition + 1,
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
    userId: string,
  ): Promise<ReturnTextBoxDTO> {
    const whiteboard = await this.whiteboardsRepo.findOne({
      where: { id: whiteboardId, isDeleted: false },
      relations: ['textBoxes', 'invitedUsers', 'author'],
    });
    if (!whiteboard) {
      throw new NotFoundException();
    }
    if (userId !== whiteboard.author.id || whiteboard.invitedUsers.find(x => x.id === userId)) {
      throw new UnauthorizedException();
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
  async delete(textBoxId: string): Promise<ReturnTextBoxDTO> {
    const textBox = await this.textBoxRepo.findOne({
        where: { id: textBoxId, isDeleted: false }
    })
    if (!textBox) {
        throw new NotFoundException();
    }
    textBox.isDeleted = true;

    return await this.textBoxRepo.save(textBox);
}
async recover(textBoxId: string): Promise<ReturnTextBoxDTO> {
    const textBox = await this.textBoxRepo.findOne({
        where: { id: textBoxId, isDeleted: true }
    });

    if (!textBox) {
        throw new NotFoundException();
    }
    textBox.isDeleted = false;

    return await this.textBoxRepo.save(textBox);
}
}
