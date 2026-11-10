import { Inject, Injectable } from '@nestjs/common';
import { GUIDE_REPOSITORY, GuideRepository } from '../../domain/repositories/guide.repository';
import { SearchQuery } from '../../domain/value-objects/search-query.vo';
import { SearchGuidesInput, SearchGuidesOutput } from '../dtos/search-guides.dto';

@Injectable()
export class SearchGuidesUseCase {
    constructor(
        @Inject(GUIDE_REPOSITORY) private readonly guides: GuideRepository,
    ) { }

    async execute(input: SearchGuidesInput): Promise<SearchGuidesOutput> {
        const query = SearchQuery.create(input.q);

        const { items, total } = await this.guides.search({
            query,
            categoryId: input.categoryId,
            page: input.page,
            limit: input.limit,
        });

        return {
            items: items.map(({ id, title, estimatedMinutes, categoryName }) => ({
                id, title, estimatedMinutes, categoryName,
            })),
            total,
            page: input.page,
            limit: input.limit,
            totalPages: Math.ceil(total / input.limit),
        };
    }
}