import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Clock, CheckCircle, XCircle, MessageSquare,
  User, Calendar, Tag, Eye, Trash2, Filter
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSupport() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const response = await api.get('/support', { params });
      setMessages(response.data.data.messages);
    } catch (error) {
      toast.error('Failed to load support messages');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (messageId, newStatus) => {
    try {
      await api.put(`/support/${messageId}/status`, { status: newStatus });
      toast.success('Status updated');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Delete this support message?')) return;
    
    try {
      await api.delete(`/support/${messageId}`);
      toast.success('Message deleted');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#FFB74D';
      case 'in-progress': return '#4FC3F7';
      case 'resolved': return '#00E3A5';
      case 'closed': return '#666';
      default: return '#9CA3AF';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💳';
      case 'course': return '📚';
      case 'feature': return '✨';
      default: return '📧';
    }
  };

  const filteredMessages = messages;
  const stats = {
    total: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    inProgress: messages.filter(m => m.status === 'in-progress').length,
    resolved: messages.filter(m => m.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-3">
            <Mail className="w-7 h-7 text-cyan-400" />
            Support Messages
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage user support requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-[var(--color-text-secondary)] text-sm">Total Messages</p>
          <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
        </div>
        <div className="card">
          <p className="text-[var(--color-text-secondary)] text-sm">New</p>
          <p className="text-2xl font-bold text-orange-400">{stats.new}</p>
        </div>
        <div className="card">
          <p className="text-[var(--color-text-secondary)] text-sm">In Progress</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.inProgress}</p>
        </div>
        <div className="card">
          <p className="text-[var(--color-text-secondary)] text-sm">Resolved</p>
          <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            Loading messages...
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-text-secondary)]">
            No support messages yet
          </div>
        ) : (
          filteredMessages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:border-purple-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(message.category)}</span>
                    <h3 className="font-semibold text-[var(--color-text)]">
                      {message.subject}
                    </h3>
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${getStatusColor(message.status)}20`,
                        color: getStatusColor(message.status)
                      }}
                    >
                      {message.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3 line-clamp-2">
                    {message.message}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {message.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {message.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); updateStatus(message._id, 'resolved'); }}
                    className="p-2 rounded-lg hover:bg-green-500/10 text-green-400"
                    title="Mark as resolved"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMessage(message._id); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  {selectedMessage.subject}
                </h2>
                <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <span>{selectedMessage.name}</span>
                  <span>•</span>
                  <span>{selectedMessage.email}</span>
                </div>
              </div>
              <span 
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${getStatusColor(selectedMessage.status)}20`,
                  color: getStatusColor(selectedMessage.status)
                }}
              >
                {selectedMessage.status}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-2 text-[var(--color-text-muted)]">Message:</p>
              <p className="text-[var(--color-text)] whitespace-pre-wrap">
                {selectedMessage.message}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => updateStatus(selectedMessage._id, 'in-progress')}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #4FC3F7, #0EA5E9)' }}
              >
                Mark In Progress
              </button>
              <button
                onClick={() => updateStatus(selectedMessage._id, 'resolved')}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #00E3A5, #10B981)' }}
              >
                Mark Resolved
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--color-surface-hover)] text-[var(--color-text)]"
              >
                Reply via Email
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
