import { useEffect, useState } from 'react';
import './LearningStatisticsPage.css';
import { LearningPathStatisticResponse } from '../../types/learningPath';
import userService from '../../services/userService';
import { formatDate } from '../../utils/dateUtils';
import useRouteNavigation from '../../hooks/useNavigation';


const LearningStatisticsPage = () => {
    const [learningPathStatistics, setLearningPathStatistics]
        = useState<LearningPathStatisticResponse[]>([]);

    const { toLearningPathDetails } = useRouteNavigation();

    const handlePathClick = (pathId: string) => {
       toLearningPathDetails(pathId);
    };

    useEffect(() => {
        const fetchLearningPathStatistics = async () => {
            const res = await userService.getAllLearningPathsStatistic();
            if (res.success && res.data) {
                setLearningPathStatistics(res.data);
            }
        };

        fetchLearningPathStatistics();
    }, []);

    return (
        <div className="progress-page">
            <h1 className="page-title">Thống kê tiến độ học tập</h1>

            <div className="learning-paths-grid">
                {learningPathStatistics.map((path) => (
                    <div
                        key={path.pathId}
                        className="path-card"
                        onClick={() => handlePathClick(path.pathId)}
                    >
                        <div className="card-header">
                            <h3 className="path-title">{path.pathTitle}</h3>
                        </div>

                        <div className="progress-section">
                            <div className="circular-progress">
                                <div
                                    className="progress-ring"
                                    style={{
                                        background: `conic-gradient(#4CAF50 ${path.overallProgress * 3.6}deg, #e0e0e0 0deg)`
                                    }}
                                >
                                    <div className="progress-text">
                                        <span className="percentage">{path.overallProgress}%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-item">
                                    <span className="stat-number">{path.totalTopics}</span>
                                    <span className="stat-label">Chủ đề</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{path.totalLessons}</span>
                                    <span className="stat-label">Bài học</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{path.completedLessons}</span>
                                    <span className="stat-label">Đã hoàn thành</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">{path.remainingLessons}</span>
                                    <span className="stat-label">Còn lại</span>
                                </div>
                            </div>
                        </div>

                        <div className="time-info">
                            <div className="time-item">
                                <span className="time-label">Bắt đầu:</span>
                                <span>{formatDate(path.startDate)}</span>
                            </div>
                            <div className="time-item">
                                <span className="time-label">Kết thúc:</span>
                                <span>{formatDate(path.endDate)}</span>
                            </div>
                            <div className="time-item">
                                <span className="time-label">Cập nhật:</span>
                                <span>{formatDate(path.lastUpdated)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningStatisticsPage;