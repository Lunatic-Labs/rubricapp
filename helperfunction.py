
# select all elements by the column name
def select_by_col_name(col_name, worksheet):
    first_row = list(worksheet.iter_rows())[0]
    index_of_col = -1
    for variables in first_row:
        if variables.value == col_name:
            index_of_col = first_row.index(variables)
    if index_of_col == -1:
        return "col_name unmatched"
    else:
        col = list(worksheet.iter_cols())[index_of_col]
        data_by_col = []
        for data in range(1, len(col)):
            data_by_col.append(col[data].value)
        return data_by_col


# index is the row index in xsl
def select_map_by_index(index, worksheet):
    list_of_rows = list(worksheet.iter_rows())
    # row_to_return = []
    # for item in list_of_rows[index-1]:
    #     row_to_return.append(item.value)
    row_selected = list_of_rows[index - 1]
    tags = list_of_rows[0]
    map_to_return = {}
    for tag_index in range(0, len(tags)):
        tag_value = tags[tag_index].value
        map_to_return[tag_value] = row_selected[tag_index].value
    return map_to_return


# index is the row index in xsl
def select_row_by_index(index, worksheet):
    list_of_rows = list(worksheet.iter_rows())
    row_to_return = []
    for item in list_of_rows[index - 1]:
        row_to_return.append(item.value)
    return row_to_return


# select by the groupid and eva name
def select_index_by_group_eva(eva_name, group_id, worksheet):
    evaluation_list = select_by_col_name("eva_name", worksheet)
    group_list = select_by_col_name("group_id", worksheet)
    list_of_result = []
    for index in range(0, len(evaluation_list)):
        if evaluation_list[index] == eva_name and group_list[index] == group_id:
            list_of_result.append(index + 2)
    return list_of_result


# group_id and eva_name and owner are primary key in eva worksheet
def select_index_by_group_eva_owner(eva_name, group_id, owner, worksheet):
    evaluation_list = select_by_col_name("eva_name", worksheet)
    group_list = select_by_col_name("group_id", worksheet)
    owner_list = select_by_col_name("owner", worksheet)
    list_of_result = []
    for index in range(0, len(evaluation_list)):
        if evaluation_list[index] == eva_name and group_list[index] == group_id and owner_list[index] == owner:
            list_of_result.append(index + 2)
    return list_of_result


# find the unique index by eva_name, group id, owner, date
def select_index_by_group_eva_owner_date(eva_name, group_id, owner, date, worksheet):
    evaluation_list = select_by_col_name("eva_name", worksheet)
    group_list = select_by_col_name("group_id", worksheet)
    owner_list = select_by_col_name("owner", worksheet)
    date_list = select_by_col_name("date", worksheet)
    for index in range(0, len(evaluation_list)):
        if evaluation_list[index] == eva_name and group_list[index] == group_id and owner_list[
            index] == owner and date == date_list[index]:
            return index + 2
    return "nothing find"


def select_row_by_group_id(col_name, col_value, worksheet):
    # we suppose that the return rows are multiple
    rows_selected = []
    rows_in_worksheet = list(worksheet.iter_rows())
    # index in data_by_col == index in row
    data_by_col = select_by_col_name(col_name, worksheet)
    for index_data in range(0, len(data_by_col)):
        if data_by_col[index_data] == col_value:
            map_to_append = {}
            # tranfer the item to item.value
            for item in rows_in_worksheet[index_data + 1]:
                # create a map contains keys-values : like "group_id" = 1
                index_of_item = rows_in_worksheet[index_data + 1].index(item)
                tag_of_item = rows_in_worksheet[0][index_of_item].value
                map_to_append[tag_of_item] = item.value
            # record each row by its group_id
            # for example : 1:{group_id = 1, date= x/y/z, eva_name = eva3, .....}.
            rows_selected.append(map_to_append)
    # if nothing matched, return the empty array;
    return rows_selected


# select all students in the group
# implement in group worksheet
def select_students_by_group(group, worksheet):
    students = []
    groups = select_by_col_name("groupid", worksheet)
    index_of_group = groups.index(group) + 2
    row_by_index = list(worksheet.iter_rows())[index_of_group - 1]
    # the first element in row_by_index is groupid
    for student in row_by_index[1:]:
        students.append(student.value)
    return students


# generate an empty map with group name and evaluation name
def new_map_generator(group, eva_name, worksheet):
    map_to_return = {}
    tags_of_item = list(worksheet.iter_rows())[0]
    for tag in tags_of_item:
        if tag.value == 'group_id':
            map_to_return[tag.value] = group
        elif tag.value == 'eva_name':
            map_to_return[tag.value] = eva_name
        else:
            map_to_return[tag.value] = ''

    return map_to_return


def new_row_generator(group, students, eva_name, worksheet):
    row_to_return = []
    tags_of_item = list(worksheet.iter_rows())[0]
    for tag in tags_of_item:
        if tag.value == 'group_id':
            row_to_return.append(group)
        elif tag.value == 'eva_name':
            row_to_return.append(eva_name)
        elif tag.value == 'date':
            date = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            row_to_return.append(date)
        elif tag.value == 'owner':
            row_to_return.append(current_user.username)
        elif tag.value == 'students':
            students_string = ",".join(students)
            row_to_return.append(students_string)
        elif tag.value == 'last_updates':
            row_to_return.append(current_user.username)
        else:
            row_to_return.append(" ")
    return row_to_return


def get_students_by_group(group_worksheet, students_worksheet):
    return_map = {}
    for group in list(group_worksheet.iter_rows())[1:]:
        return_map[group[0].value] = []
        for email in group[1:]:
            if email.value is not None:
                index = select_by_col_name('Email', students_worksheet).index(email.value)
                student_name = select_by_col_name('Student', students_worksheet)[index]
                student_couple = [email.value, student_name]
                return_map[group[0].value].append(student_couple)
    return return_map
