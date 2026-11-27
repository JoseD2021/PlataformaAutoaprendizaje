import { Inject, Injectable } from '@nestjs/common';
import { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotRecordDoubtError } from '../../domain/errors/doubt.errors';
import {
  DOUBT_REPOSITORY,
  DoubtRepository,
} from '../../domain/repositories/doubt.repository';
import { DoubtNotFoundError } from '../errors/doubt.errors';

export interface DeleteDoubtActor {
  permissions: Permission[];
}

@Injectable()
export class DeleteDoubtUseCase {
  constructor(
    @Inject(DOUBT_REPOSITORY) private readonly doubts: DoubtRepository,
  ) {}

  async execute(id: string, actor: DeleteDoubtActor): Promise<void> {
    if (!actor.permissions.includes(Permission.DOUBTS_MANAGE)) {
      throw new CannotRecordDoubtError('No tienes permiso para eliminar dudas.');
    }

    const doubt = await this.doubts.findById(id);

    if (!doubt) {
      throw new DoubtNotFoundError();
    }

    await this.doubts.delete(id);
  }
}
