import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';
import { isRTL } from '../i18n';
import api from '../lib/api';

export default function ChatScreen() {
  const locale = isRTL() ? 'ar' : 'en';
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post<{ reply: string }>('/ai/chat', { messages: newMsgs });
      setMessages([...newMsgs, { role: 'assistant', content: res.reply }]);
    } catch { setMessages([...newMsgs, { role: 'assistant', content: locale === 'ar' ? 'عذراً، حدث خطأ' : 'Sorry, error occurred' }]); }
    finally { setLoading(false); }
  };

  return (
    <View style={s.container}>
      <ScrollView style={s.messages} contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}>
        {messages.length === 0 && <Text style={s.welcome}>{locale === 'ar' ? 'مرحباً! كيف أساعدك؟' : 'Hi! How can I help?'}</Text>}
        {messages.map((m, i) => (
          <View key={i} style={[s.bubble, m.role === 'user' ? s.userBubble : s.aiBubble]}>
            <Text style={[s.bubbleText, m.role === 'user' && { color: '#fff' }]}>{m.content}</Text>
          </View>
        ))}
        {loading && <View style={s.aiBubble}><Text style={s.bubbleText}>...</Text></View>}
      </ScrollView>
      <View style={s.inputRow}>
        <TextInput style={s.input} value={input} onChangeText={setInput} placeholder={locale === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'} placeholderTextColor={colors.light.textTertiary} onSubmitEditing={send} />
        <TouchableOpacity style={s.sendBtn} onPress={send}><Text style={{ color: '#fff', fontSize: 18 }}>→</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  messages: { flex: 1 },
  welcome: { textAlign: 'center', color: colors.light.textSecondary, padding: spacing.xl },
  bubble: { maxWidth: '80%', padding: spacing.md, borderRadius: radius.lg },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: colors.light.surfaceSecondary, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20, color: colors.light.text },
  inputRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm, borderTopWidth: 1, borderColor: colors.light.border },
  input: { flex: 1, backgroundColor: colors.light.surfaceSecondary, padding: spacing.md, borderRadius: radius.full, fontSize: 15, color: colors.light.text },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
