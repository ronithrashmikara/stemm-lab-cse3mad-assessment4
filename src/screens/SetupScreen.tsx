import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { createId, createTeamDiscriminator } from '../domain/ids';
import type { TeamProfile } from '../types';
import { PrimaryButton, SectionCard } from '../ui/components';
import { colors, globalStyles } from '../ui/theme';

type Props = {
  existingTeam: TeamProfile | null;
  onSave: (team: TeamProfile) => Promise<void>;
};

export function SetupScreen({ existingTeam, onSave }: Props) {
  const [teamName, setTeamName] = useState(existingTeam?.teamName ?? 'STEMM Lab Team');
  const [yearLevel, setYearLevel] = useState(existingTeam?.yearLevel ?? 'Year 7');
  const [members, setMembers] = useState(existingTeam?.memberNames.join(', ') ?? '');
  const [saving, setSaving] = useState(false);

  const memberNames = useMemo(
    () =>
      members
        .split(',')
        .map((member) => member.trim())
        .filter(Boolean),
    [members],
  );

  const canSave = teamName.trim().length > 1 && memberNames.length > 0 && yearLevel.trim().length > 0;

  const save = async () => {
    if (!canSave) {
      return;
    }

    setSaving(true);
    const team: TeamProfile = {
      id: existingTeam?.id ?? createId('TEAM'),
      teamName: teamName.trim(),
      yearLevel: yearLevel.trim(),
      memberNames,
      discriminator: existingTeam?.discriminator ?? createTeamDiscriminator(teamName, memberNames.length),
      createdAt: existingTeam?.createdAt ?? new Date().toISOString(),
    };

    await onSave(team);
    setSaving(false);
  };

  return (
    <SectionCard title="Team setup">
      <Text style={globalStyles.body}>
        Create the team profile that appears in local SQLite records, Firestore sync payloads, exported evidence, and the
        presentation demo.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Team name</Text>
        <TextInput style={styles.input} value={teamName} onChangeText={setTeamName} placeholder="Team STEMM" />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Team members</Text>
        <TextInput
          style={styles.input}
          value={members}
          onChangeText={setMembers}
          placeholder="Kaveeja, Partner name"
          autoCapitalize="words"
        />
        <Text style={styles.help}>Use commas to separate names. Both members should understand all code for Q&A.</Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Grade or year level</Text>
        <TextInput style={styles.input} value={yearLevel} onChangeText={setYearLevel} placeholder="Year 7" />
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewLabel}>Assigned discriminator</Text>
        <Text style={styles.previewValue}>{createTeamDiscriminator(teamName, Math.max(memberNames.length, 1))}</Text>
      </View>

      <PrimaryButton label={saving ? 'Saving...' : 'Save team and continue'} onPress={save} disabled={!canSave || saving} />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  input: {
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 12,
    color: colors.text,
    fontSize: 15,
  },
  help: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  preview: {
    borderRadius: 8,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12,
    backgroundColor: colors.softBlue,
  },
  previewLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  previewValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
});
