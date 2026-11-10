import type { Permission } from '../../../users/domain/enums/permission.enum';
import { CannotManageGuideError } from '../../domain/errors/guide.errors';

export interface GuideActor {
  permissions: Permission[];
}

export function assertGuidePermission(actor: GuideActor, permission: Permission): void {
  if (!actor.permissions.includes(permission)) {
    throw new CannotManageGuideError();
  }
}