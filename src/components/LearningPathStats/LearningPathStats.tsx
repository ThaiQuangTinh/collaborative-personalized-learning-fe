import React from 'react';
import { LearningPathStatisticResponse } from '../../types/learningPath';
import { formatDate } from '../../utils/dateUtils';
import './LearningPathStats.css';

interface LearningPathStatsProps {
    statistic: LearningPathStatisticResponse | null;
}

const LearningPathStats: React.FC<LearningPathStatsProps> = ({ statistic }) => {
    return (
        <div className="sidebar">
            <div className="stats-section">
                <h3><i className="fas fa-chart-line"></i> Thống kê tiến độ</h3>

                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-value">{statistic?.totalTopics || 0}</div>
                        <div className="stat-label">Chủ đề</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{statistic?.totalLessons || 0}</div>
                        <div className="stat-label">Bài học</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{statistic?.completedLessons || 0}</div>
                        <div className="stat-label">Đã hoàn thành</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{statistic?.remainingLessons || 0}</div>
                        <div className="stat-label">Còn lại</div>
                    </div>
                </div>

                <div className="progress-container">
                    <div className="progress-header">
                        <span>Tiến độ tổng thể</span>
                        <span>{statistic?.overallProgress || 0}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${statistic?.overallProgress || 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="time-section">
                <h3><i className="fas fa-clock"></i> Thời gian học</h3>

                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-value">
                            {statistic?.durationMonths || 0}
                        </div>
                        <div className="stat-label">Tháng</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {statistic?.durationDays || 0}
                        </div>
                        <div className="stat-label">Ngày</div>
                    </div>
                </div>

                <div className="time-details">
                    <div className="time-item">
                        <strong>Bắt đầu:</strong> {formatDate(statistic?.startDate!)}
                    </div>
                    <div className="time-item">
                        <strong>Kết thúc:</strong> {formatDate(statistic?.endDate!)}
                    </div>
                    <div className="time-item">
                        <strong>Cập nhật:</strong> {formatDate(statistic?.lastUpdated!)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPathStats;