export default class AntdUtils {
  static treeData(list) {
    return list.map((e) => {
      return {
        title: e.name,
        value: `${e.key}`,
        key: `${e.key}`,
        children: AntdUtils.treeData(e.children || []),
        grade: `${e.grade || e.grade === 0 ? e.grade : null}`,
      };
    });
  }

  static cascaderData(list) {
    return list.map((e) => {
      if (e.children) {
        return {
          label: `${e.name}`,
          value: `${e.key}`,
          key: `${e.key}`,
          children: AntdUtils.cascaderData(e.children || []),
          grade: `${e.grade ? e.grade : null}`,
        };
      } else {
        return {
          label: `${e.name}`,
          value: `${e.key}`,
          key: `${e.key}`,
        };
      }
    });
  }
}
