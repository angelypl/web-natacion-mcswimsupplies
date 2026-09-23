#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/7a0ad7cc2e2dd419b47b9f457beed4e49f083aefddae5e7719fa50753d5b02eb/contract';
import endContract from '../../snapshots/7a0ad7cc2e2dd419b47b9f457beed4e49f083aefddae5e7719fa50753d5b02eb/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'attendanceRecord',
        columns: [
          col('date', 'date', { notNull: true, codecRef: { codecId: 'pg/date-string@1' } }),
          col('enrollmentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('present', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'branch',
        columns: [
          col('address', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'enrollment',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('startDate', 'date', { notNull: true, codecRef: { codecId: 'pg/date-string@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('swimClassId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'student',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('fullName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('parentName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'swimClass',
        columns: [
          col('ageGroup', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('branchId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('capacity', 'int4', {
            notNull: true,
            default: lit(20),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('category', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('day', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('notes', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('time', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'attendanceRecord',
        constraint: 'attendanceRecord_enrollmentId_date_key',
        columns: ['enrollmentId', 'date'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'branch',
        constraint: 'branch_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'attendanceRecord',
        index: 'attendanceRecord_enrollmentId_idx_ee5e79c5',
        columns: ['enrollmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'enrollment',
        index: 'enrollment_swimClassId_idx_281360f5',
        columns: ['swimClassId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'swimClass',
        index: 'swimClass_branchId_idx_d04da5bb',
        columns: ['branchId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'attendanceRecord',
        foreignKey: {
          name: 'attendanceRecord_enrollmentId_fkey',
          columns: ['enrollmentId'],
          references: { schema: 'public', table: 'enrollment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'enrollment',
        foreignKey: {
          name: 'enrollment_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'enrollment',
        foreignKey: {
          name: 'enrollment_swimClassId_fkey',
          columns: ['swimClassId'],
          references: { schema: 'public', table: 'swimClass', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'swimClass',
        foreignKey: {
          name: 'swimClass_branchId_fkey',
          columns: ['branchId'],
          references: { schema: 'public', table: 'branch', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
