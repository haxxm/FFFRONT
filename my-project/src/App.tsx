import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import type { User, CalendarEvent, Announcement } from './types';
import api from './api';

import { CalendarView } from './components/CalendarView';
import { Community } from './components/Community';
import { AuthScreen } from './components/AuthScreen';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    if (user) {
      const startDate = new Date('2025-01-01').toISOString();
      const endDate = new Date('2025-12-31').toISOString();
      api.fetchEvents(startDate, endDate).then(setEvents);

      api.fetchPosts().then((apiPosts) => {
        const formattedAnnouncements = apiPosts.map((post) => ({
          id: post.postNum,
          title: post.title,
          content: post.content,
          author: post.author?.userName || 'Unknown',
          timestamp: new Date(post.createdAt),
          isPinned: false,
        }));
        setAnnouncements(formattedAnnouncements);
      });
    }
  }, [user]);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await api.deleteEvent(eventId);
      setEvents(prevEvents => prevEvents.filter(event => event.eventNum !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleAddEvent = async (eventData: Omit<CalendarEvent, 'eventNum'>) => {
    try {
      const newEvent = await api.addEvent(eventData);
      setEvents(prevEvents => [...prevEvents, newEvent]);
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const handleUpdateEvent = async (eventId: number, updatedData: Partial<CalendarEvent>) => {
    try {
      const updatedEvent = await api.updateEvent(eventId, updatedData);
      setEvents(prevEvents =>
        prevEvents.map(event => (event.eventNum === eventId ? updatedEvent : event))
      );
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  // AuthScreen 컴포넌트가 필요로 하는 더미 함수들
  const handleSocialLogin = (provider: string) => console.log(`${provider} login`);
  const handleShowSignup = () => console.log('Show signup');

  if (!user) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        onSocialLogin={handleSocialLogin} // 누락된 prop 추가
        onShowSignup={handleShowSignup}   // 누락된 prop 추가
      />
    );
  }

  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
            <Route
              path="/calendar"
              element={
                <CalendarView
                  events={events}
                  onDeleteEvent={handleDeleteEvent}
                  onAddEvent={handleAddEvent}
                  onUpdateEvent={handleUpdateEvent}
                />
              }
            />
            <Route
              path="/community"
              element={
                <Community
                  announcements={announcements}
                  comments={[]} // 더미 데이터 전달
                  onBack={() => window.history.back()} // 누락된 prop 추가
                  onPostClick={(post) => console.log('Post clicked', post)} // 누락된 prop 추가
                  onAddComment={(announcementId, content) => console.log(announcementId, content)} // 누락된 prop 추가
                  onDeleteComment={(commentId) => console.log('Delete comment', commentId)} // 누락된 prop 추가
                  calendarId="1" // 더미 데이터 전달
                  calendarName="My Calendar" // 더미 데이터 전달
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;