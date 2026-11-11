export interface FavoriteProps {
  userId: string;
  guideId: string;
  createdAt: Date;
}

export interface CreateFavoriteProps {
  userId: string;
  guideId: string;
  now?: Date;
}

/**
 * Relación entre un usuario y la guía que marcó como favorita.
 */
export class Favorite {
  private constructor(private props: FavoriteProps) {}

  static create(props: CreateFavoriteProps): Favorite {
    return new Favorite({
      userId: props.userId,
      guideId: props.guideId,
      createdAt: props.now ?? new Date(),
    });
  }

  static rehydrate(props: FavoriteProps): Favorite {
    return new Favorite({ ...props });
  }

  get userId(): string {
    return this.props.userId;
  }

  get guideId(): string {
    return this.props.guideId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
