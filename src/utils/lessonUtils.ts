
import { LearningStatus } from '../constants/learningStatus';
import { Lesson } from '../types/lesson';

export const getStatusText = (lesson: Lesson) => {
    switch (lesson.status) {
        case LearningStatus.NOT_STARTED:
            return lesson.isUnlocked ? 'Chưa bắt đầu' : 'Chưa thể học';
        case LearningStatus.IN_PROGRESS:
            return 'Đang học';
        case LearningStatus.COMPLETED:
            return 'Hoàn thành';
        default:
            return 'Chưa bắt đầu';
    }
};

export const getStatusClass = (lesson: Lesson) => {
    switch (lesson.status) {
        case LearningStatus.NOT_STARTED:
            return lesson.isUnlocked ? 'not-started' : 'disabled';
        case LearningStatus.IN_PROGRESS:
            return 'in-progress';
        case LearningStatus.COMPLETED:
            return 'completed';
        default:
            return 'not-started';
    }
};

export const getStatusBadgeClass = (lesson: Lesson) => {
    switch (lesson.status) {
        case LearningStatus.NOT_STARTED:
            return lesson.isUnlocked ? 'status-not-started' : 'status-disabled';
        case LearningStatus.IN_PROGRESS:
            return 'status-in-progress';
        case LearningStatus.COMPLETED:
            return 'status-completed';
        default:
            return 'status-not-started';
    }
};
