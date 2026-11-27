import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotRecordDoubtError } from '../../domain/errors/doubt.errors';
import {
  DOUBT_REPOSITORY,
  DoubtRepository,
} from '../../domain/repositories/doubt.repository';
import { DoubtModel, toDoubtModel } from '../models/doubt-view.model';

export interface ListDoubtsActor {
  permissions: Permission[];
}

@Injectable()
export class ListDoubtsUseCase {
  constructor(
    @Inject(DOUBT_REPOSITORY) private readonly doubts: DoubtRepository,
  ) {}

  async execute(actor: ListDoubtsActor): Promise<DoubtModel[]> {
    if (!actor.permissions.includes(Permission.DOUBTS_MANAGE)) {
      throw new CannotRecordDoubtError('No tienes permiso para consultar las dudas.');
    }

    const doubts = await this.doubts.findAll();

    // Las más preguntadas primero; en empate, la más reciente.
    return doubts
      .sort(
        (a, b) =>
          b.times - a.times || b.lastAskedAt.getTime() - a.lastAskedAt.getTime(),
      )
      .map(toDoubtModel);
  }
}
