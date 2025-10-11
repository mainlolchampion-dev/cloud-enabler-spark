import { supabase } from "@/integrations/supabase/client";

export interface Table {
  id: string;
  invitationId: string;
  tableNumber: number;
  tableName?: string;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface TableAssignment {
  id: string;
  guestId: string;
  tableId: string;
  createdAt: string;
}

export interface TableWithGuests extends Table {
  guests: Array<{
    id: string;
    name: string;
    plusOne?: string;
  }>;
}

// Get all tables for an invitation
export async function getTables(invitationId: string): Promise<Table[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('table_number', { ascending: true });

  if (error) {
    console.error('Error fetching tables:', error);
    return [];
  }

  return data.map(table => ({
    id: table.id,
    invitationId: table.invitation_id,
    tableNumber: table.table_number,
    tableName: table.table_name,
    capacity: table.capacity,
    createdAt: table.created_at,
    updatedAt: table.updated_at,
  }));
}

// Create a table
export async function createTable(table: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>): Promise<Table> {
  const { data, error } = await supabase
    .from('tables')
    .insert({
      invitation_id: table.invitationId,
      table_number: table.tableNumber,
      table_name: table.tableName,
      capacity: table.capacity,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    invitationId: data.invitation_id,
    tableNumber: data.table_number,
    tableName: data.table_name,
    capacity: data.capacity,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update a table
export async function updateTable(id: string, updates: Partial<Table>): Promise<void> {
  const dbUpdates: any = {};
  
  if (updates.tableNumber !== undefined) dbUpdates.table_number = updates.tableNumber;
  if (updates.tableName !== undefined) dbUpdates.table_name = updates.tableName;
  if (updates.capacity !== undefined) dbUpdates.capacity = updates.capacity;

  const { error } = await supabase
    .from('tables')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

// Delete a table
export async function deleteTable(id: string): Promise<void> {
  const { error } = await supabase
    .from('tables')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Assign guest to table
export async function assignGuestToTable(guestId: string, tableId: string): Promise<void> {
  // First, remove any existing assignment
  await supabase
    .from('guest_table_assignments')
    .delete()
    .eq('guest_id', guestId);

  // Then create new assignment
  const { error } = await supabase
    .from('guest_table_assignments')
    .insert({
      guest_id: guestId,
      table_id: tableId,
    });

  if (error) throw error;
}

// Remove guest from table
export async function removeGuestFromTable(guestId: string): Promise<void> {
  const { error } = await supabase
    .from('guest_table_assignments')
    .delete()
    .eq('guest_id', guestId);

  if (error) throw error;
}

// Get tables with assigned guests
export async function getTablesWithGuests(invitationId: string): Promise<TableWithGuests[]> {
  const tables = await getTables(invitationId);
  
  // Get all guests for this invitation
  const { data: guests, error: guestsError } = await supabase
    .from('guests')
    .select('id, first_name, last_name, plus_one_name')
    .eq('invitation_id', invitationId);

  if (guestsError) throw guestsError;

  // Get all assignments
  const { data: assignments, error: assignmentsError } = await supabase
    .from('guest_table_assignments')
    .select('guest_id, table_id');

  if (assignmentsError) throw assignmentsError;

  // Map assignments to tables
  return tables.map(table => {
    const tableAssignments = assignments?.filter(a => a.table_id === table.id) || [];
    const tableGuests = tableAssignments.map(assignment => {
      const guest = guests?.find(g => g.id === assignment.guest_id);
      return {
        id: guest?.id || '',
        name: `${guest?.first_name} ${guest?.last_name}`,
        plusOne: guest?.plus_one_name,
      };
    });

    return {
      ...table,
      guests: tableGuests,
    };
  });
}
